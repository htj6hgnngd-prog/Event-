#!/usr/bin/env python3
"""VECTA Content Director: source-grounded photo selection. Never generates or alters source photos."""
from __future__ import annotations
import argparse, base64, csv, json, mimetypes, os, re, sys, time
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
API = "https://api.openai.com/v1/responses"
YANDEX_API = "https://cloud-api.yandex.net/v1/disk/public/resources"

def request_json(url, headers=None, payload=None, timeout=90):
    data = json.dumps(payload).encode() if payload is not None else None
    h = {"User-Agent": "VECTA-Content-Director/1.0"}
    if payload is not None: h["Content-Type"] = "application/json"
    if headers: h.update(headers)
    with urlopen(Request(url, data=data, headers=h), timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))

def download(url, dest):
    req = Request(url, headers={"User-Agent": "VECTA-Content-Director/1.0"})
    with urlopen(req, timeout=90) as r:
        dest.write_bytes(r.read())
    return dest

def yandex_items(public_url, path):
    items, offset = [], 0
    while True:
        url = YANDEX_API + "?" + urlencode({"public_key": public_url, "path": path, "limit": 100, "offset": offset})
        result = request_json(url)
        embedded = result.get("_embedded", {})
        batch = [x for x in embedded.get("items", []) if x.get("type") == "file" and Path(x.get("name", "")).suffix.lower() in IMAGE_EXTS]
        items.extend(batch)
        total = embedded.get("total", len(items))
        offset += len(embedded.get("items", []))
        if not embedded.get("items") or offset >= total: break
    return items

def yandex_download_href(public_url, path):
    url = YANDEX_API + "/download?" + urlencode({"public_key": public_url, "path": path})
    return request_json(url)["href"]

def collect_source(args, work):
    source = work / "source"
    source.mkdir(parents=True, exist_ok=True)
    if args.input_dir:
        root = Path(args.input_dir).expanduser().resolve()
        files = sorted(p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in IMAGE_EXTS)
        if not files: raise RuntimeError("В указанной папке не найдено изображений JPEG/PNG/WebP.")
        return files, {p.name: p for p in files}, {"source":"local_folder","count":len(files)}, {}
    items = yandex_items(args.yandex_url, args.yandex_path)
    if not items: raise RuntimeError("В публичной папке Яндекс Диска не найдены изображения.")
    files, original_paths = [], {}
    for i, item in enumerate(items, 1):
        name = Path(item["name"]).name
        safe = source / name
        if safe.exists():
            raise RuntimeError(f"Повторяющееся имя файла в источнике: {name}")
        preview = item.get("preview")
        if not preview:
            href = yandex_download_href(args.yandex_url, item.get("path") or f"{args.yandex_path}/{name}")
        else: href = preview
        download(href, safe)
        files.append(safe)
        original_paths[name] = (args.yandex_path.rstrip("/") + "/" + name)
    return files, {p.name: p for p in files}, {"source":"yandex_public_folder","path":args.yandex_path,"count":len(files)}, original_paths

def image_data_uri(path, max_side=1200, quality=78):
    try:
        from PIL import Image, ImageOps
    except ImportError as exc:
        raise RuntimeError("Установите Pillow: pip install pillow") from exc
    import io
    im = Image.open(path).convert("RGB")
    im.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)
    buff = io.BytesIO()
    im.save(buff, format="JPEG", quality=quality, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(buff.getvalue()).decode()

def response_text(data):
    if data.get("output_text"): return data["output_text"]
    parts = []
    for item in data.get("output", []):
        for c in item.get("content", []):
            if c.get("type") == "output_text": parts.append(c.get("text", ""))
    return "\n".join(parts)

def parse_json_text(text):
    text = text.strip()
    try: return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}|\[.*\]", text, re.S)
        if not match: raise
        return json.loads(match.group(0))

def call_model(api_key, model, system_prompt, content, max_output_tokens=5000):
    payload = {
        "model": model,
        "input": [
            {"role":"system","content":[{"type":"input_text","text":system_prompt}]},
            {"role":"user","content":content},
        ],
        "text":{"format":{"type":"json_object"}},
        "max_output_tokens":max_output_tokens,
    }
    data = request_json(API, {"Authorization":"Bearer "+api_key}, payload, timeout=180)
    return parse_json_text(response_text(data))

def load_agent_docs():
    here = Path(__file__).resolve().parent.parent
    names = ["AGENT_PROMPT.md","EDITORIAL_SYSTEM.md","QUALITY_GATE.md","VISUAL_TASTE_PROTOCOL.md"]
    docs = []
    for name in names:
        p = here / name
        if p.exists(): docs.append(f"\n\n===== {name} =====\n"+p.read_text(encoding="utf-8"))
    if not docs: raise RuntimeError("Не найдены инструкции VECTA Content Director рядом с runtime.")
    return "\n".join(docs)

def score_batch(api_key, model, system_prompt, batch, index, total):
    content = [{"type":"input_text","text":
        "Это пакет "+str(index)+"/"+str(total)+". Оцени КАЖДЫЙ приложенный реальный кадр независимо. "
        "Не угадывай сюжет за пределами видимого. Возвращай только JSON-объект {\"photos\":[...]}. "
        "Каждый объект: filename (строго точное имя из метки), scores с 8 целыми оценками 0..4 "
        "(composition, light, color, gesture_space, sequence_potential, specificity, restraint, coherence), "
        "technical_issues (массив коротких строк), strongest_role (коротко), reason (конкретно 1-2 предложения), "
        "candidate (true/false). Оцени качество самого кадра и потенциал для серии раздельно; не ставь высокий балл "
        "только за резкость/эмоцию. Не выбирай кадры по имени файла. Если файл не читается, отметь это в technical_issues."}]
    for p in batch:
        content.append({"type":"input_text","text":"FILENAME: "+p.name})
        content.append({"type":"input_image","image_url":image_data_uri(p, 900, 68),"detail":"low"})
    out = call_model(api_key, model, system_prompt, content, 6000)
    photos = out.get("photos")
    if not isinstance(photos, list): raise RuntimeError(f"Модель не вернула массив photos для пакета {index}.")
    return photos

def shortlist_payload(ratings, files, limit=28):
    # Aggregate 8 dimensions, prefer strong images while retaining different possible roles.
    def total(row):
        scores = row.get("scores", {})
        vals = [v for v in scores.values() if isinstance(v, (int,float))]
        return sum(vals) if vals else 0
    valid = [x for x in ratings if x.get("filename") in files]
    valid.sort(key=total, reverse=True)
    picked, roles = [], set()
    # First reserve several high-ranked frames across different roles.
    for row in valid:
        role = str(row.get("strongest_role","")).lower()
        if role and role not in roles and len(picked) < max(8, limit//2):
            picked.append(row); roles.add(role)
    for row in valid:
        if row not in picked and len(picked) < limit: picked.append(row)
    return picked

def original_path_for_yandex(public_url, path, dest):
    href = yandex_download_href(public_url, path)
    return download(href, dest)

def render_contact_sheet(files, output_path, labels=None, cols=4, thumb_w=250, thumb_h=320):
    from PIL import Image, ImageOps, ImageDraw, ImageFont
    rows = (len(files)+cols-1)//cols
    gap, label_h = 12, 32
    canvas = Image.new("RGB",(gap+cols*(thumb_w+gap), gap+rows*(thumb_h+label_h+gap)),(16,16,16))
    draw = ImageDraw.Draw(canvas)
    try: font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",12)
    except OSError: font = ImageFont.load_default()
    for i,p in enumerate(files):
        im = Image.open(p).convert("RGB")
        im = ImageOps.contain(im,(thumb_w,thumb_h),Image.Resampling.LANCZOS)
        x = gap+(i%cols)*(thumb_w+gap); y = gap+(i//cols)*(thumb_h+label_h+gap)
        canvas.paste(im,(x+(thumb_w-im.width)//2,y+(thumb_h-im.height)//2))
        label = labels[i] if labels else p.name
        draw.text((x,y+thumb_h+4),str(label)[:42],fill=(240,240,240),font=font)
    output_path.parent.mkdir(parents=True,exist_ok=True)
    canvas.save(output_path,quality=88,optimize=True)

def final_sequence(api_key, model, system_prompt, candidates, file_map):
    content=[{"type":"input_text","text":
      "Теперь редакторский pass. Тебе доступны визуальные кадры кандидатов и их первичные оценки. "
      "Сформируй одну цельную фотосерию для VECTA: обычно 8-12 изображений, но используй меньше, если массив слаб. "
      "Не добавляй кадры ради количества. Подбери обложку, проверь повторы соседних планов/жестов/палитры, "
      "построй визуальный ритм, выбери финал с причиной. Верни JSON: {\"visual_thesis\":\"...\","
      "\"selection\":[{\"position\":1,\"filename\":\"exact source filename\",\"role\":\"...\","
      "\"reason\":\"...\",\"score_32\":0}],\"excluded_patterns\":[\"...\"],"
      "\"alternate_covers\":[\"exact filename\"],\"quality_gate\":{\"score_50\":0,\"failures\":[],"
      "\"verdict\":\"ready/revise/rebuild\"}}. Не выдумывай содержимое. Все filenames обязаны совпадать с метками. "
      "Суммарный score_32 может быть целым 0..32 и должен отражать 8 измерений. "
      "Не называй результат готовым, если слабая последовательность или score ниже 24."}]
    for c in candidates:
        p=file_map[c["filename"]]
        content.append({"type":"input_text","text":"CANDIDATE FILE: "+p.name+" | first_pass: "+json.dumps(c,ensure_ascii=False)})
        content.append({"type":"input_image","image_url":image_data_uri(p,1600,84),"detail":"high"})
    out=call_model(api_key,model,system_prompt,content,7000)
    if not isinstance(out.get("selection"),list): raise RuntimeError("Модель не вернула selection.")
    known=set(file_map)
    out["selection"]=[x for x in out["selection"] if x.get("filename") in known]
    if len(out["selection"]) < 3: raise RuntimeError("Финальная выборка не прошла проверку точных имён файлов.")
    out["selection"].sort(key=lambda x:int(x.get("position",999)))
    return out

def main():
    ap=argparse.ArgumentParser(description="Run VECTA Content Director on real photos. Requires OPENAI_API_KEY.")
    group=ap.add_mutually_exclusive_group(required=True)
    group.add_argument("--input-dir", help="Folder containing local source images")
    group.add_argument("--yandex-url", help="Public Yandex Disk share URL")
    ap.add_argument("--yandex-path",default="/JPEG")
    ap.add_argument("--out",default="vecta-selection-output")
    ap.add_argument("--batch-size",type=int,default=6)
    ap.add_argument("--shortlist",type=int,default=28)
    ap.add_argument("--score-model",default=os.getenv("OPENAI_SCORE_MODEL","gpt-4.1-mini"))
    ap.add_argument("--final-model",default=os.getenv("OPENAI_FINAL_MODEL","gpt-4.1"))
    args=ap.parse_args()
    api_key=os.getenv("OPENAI_API_KEY")
    if not api_key: raise SystemExit("BLOCKED: OPENAI_API_KEY is not configured. Add it to the runtime environment; do not paste it into source code.")
    work=Path(args.out).resolve(); work.mkdir(parents=True,exist_ok=True)
    files,file_map,inventory,original_paths=collect_source(args,work)
    # Ensure duplicate names from separate folders remain uniquely addressable.
    if len({p.name for p in files}) != len(files):
        raise RuntimeError("Есть повторяющиеся имена файлов. Разнесите их по подпапкам/переименуйте до запуска.")
    print(f"Inventory complete: {len(files)} images.",flush=True)
    render_contact_sheet(files,work/"all_sources.jpg")
    system_prompt=load_agent_docs()+"\n\nExecution constraints: Use only supplied real source images; never generate or alter source photography. Exact filenames are mandatory. Reject uncertain or generic selections."
    ratings=[]
    batches=[files[i:i+args.batch_size] for i in range(0,len(files),args.batch_size)]
    for i,batch in enumerate(batches,1):
        result=score_batch(api_key,args.score_model,system_prompt,batch,i,len(batches))
        by_name={p.name for p in batch}
        ratings.extend([row for row in result if row.get("filename") in by_name])
        print(f"Scored batch {i}/{len(batches)}: {len(ratings)}/{len(files)} valid images",flush=True)
        time.sleep(0.15)
    (work/"scores.json").write_text(json.dumps({"inventory":inventory,"ratings":ratings},ensure_ascii=False,indent=2),encoding="utf-8")
    candidates=shortlist_payload(ratings,{p.name:p for p in files},args.shortlist)
    candidate_files=[file_map[c["filename"]] for c in candidates]
    render_contact_sheet(candidate_files,work/"candidate_sheet.jpg",[f'{i+1:02d} {c["filename"]}' for i,c in enumerate(candidates)])
    print(f"Final editorial pass: {len(candidates)} candidates.",flush=True)
    final_file_map = dict(file_map)
    inspected_originals = 0
    if args.yandex_url:
        originals_dir = work / "originals"
        originals_dir.mkdir(parents=True, exist_ok=True)
        for c in candidates:
            name = c["filename"]
            if name not in original_paths:
                continue
            dest = originals_dir / name
            try:
                original_path_for_yandex(args.yandex_url, original_paths[name], dest)
                final_file_map[name] = dest
                inspected_originals += 1
            except Exception as exc:
                print(f"WARNING: full-resolution download failed for {name}: {exc}", file=sys.stderr, flush=True)
    final=final_sequence(api_key,args.final_model,system_prompt,candidates,final_file_map)
    final["inventory"]=inventory
    final["scored_file_count"]=len(ratings)
    final["full_resolution_finalists_inspected"]=inspected_originals
    final["source_review"]=("preview-level first pass; " + str(inspected_originals) + " finalists checked from original files")
    if not args.yandex_url:
        final["source_review"]="provided local files inspected; resolution depends on the files in input directory"
    (work/"selection.json").write_text(json.dumps(final,ensure_ascii=False,indent=2),encoding="utf-8")
    chosen=[final_file_map[x["filename"]] for x in final["selection"]]
    labels=[f'{x.get("position",i+1):02d} {x.get("filename","")}' for i,x in enumerate(final["selection"])]
    render_contact_sheet(chosen,work/"selected_sequence.jpg",labels,cols=3,thumb_w=360,thumb_h=440)
    with (work/"ratings.csv").open("w",newline="",encoding="utf-8-sig") as f:
        fields=["filename","total_32","candidate","strongest_role","reason","technical_issues"]
        w=csv.DictWriter(f,fieldnames=fields); w.writeheader()
        for row in sorted(ratings,key=lambda r:sum(v for v in r.get("scores",{}).values() if isinstance(v,(int,float))),reverse=True):
            scores=row.get("scores",{})
            w.writerow({"filename":row.get("filename",""),"total_32":sum(v for v in scores.values() if isinstance(v,(int,float))),"candidate":row.get("candidate",False),"strongest_role":row.get("strongest_role",""),"reason":row.get("reason",""),"technical_issues":"; ".join(row.get("technical_issues",[]))})
    print(json.dumps({"status":"completed","source_count":len(files),"scored_count":len(ratings),"selected_count":len(chosen),"output_dir":str(work),"selection":[x["filename"] for x in final["selection"]],"verdict":final.get("quality_gate",{}).get("verdict")},ensure_ascii=False,indent=2))

if __name__=="__main__":
    try: main()
    except HTTPError as e: print(f"HTTP error {e.code}: {e.read().decode('utf-8','replace')[:800]}",file=sys.stderr); sys.exit(2)
    except (URLError,TimeoutError) as e: print(f"Network error: {e}",file=sys.stderr); sys.exit(2)
    except Exception as e: print(f"ERROR: {e}",file=sys.stderr); sys.exit(1)
