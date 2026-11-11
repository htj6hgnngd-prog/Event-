from pathlib import Path
import json,re,base64
root=Path(__file__).resolve().parent.parent
out=root/'design-review/src/components/generated';out.mkdir(parents=True,exist_ok=True)
pages={}
for name in json.loads((root/'docs/desktop-pages.json').read_text()):
 s=(root/name).read_text();body=re.search(r'<body[^>]*>(.*?)</body>',s,re.S)[1];pages['/'+name if name!='index.html' else '/']=re.sub(r'<script.*?</script>','',body,flags=re.S)
(out/'pages.ts').write_text('const pages:Record<string,string>='+json.dumps(pages,ensure_ascii=False)+';\nexport default pages;\n')
css=(root/'design.css').read_text()+'\n'+(root/'editorial-desktop.css').read_text()
for font in ['cormorant-regular','cormorant-italic','manrope-regular','playfair-upright','playfair-italic']:
 css=css.replace("'/fonts/"+font+".woff2'","'data:font/woff2;base64,"+base64.b64encode((root/'fonts'/f'{font}.woff2').read_bytes()).decode()+"'")
for prefix in ['@media(max-width:1000px)','@media(max-width:650px)']:
 start=css.find(prefix)
 if start<0:continue
 brace=css.index('{',start);depth=1;end=brace+1
 while depth:
  if css[end]=='{':depth+=1
  elif css[end]=='}':depth-=1
  end+=1
 css=css[:start]+css[end:]
css=re.sub(r'(?<![\w.#-])(?:html|body)\{','.vecta-preview{',css)
css+='\n.vecta-preview{width:1440px;height:900px;overflow:auto;position:relative;isolation:isolate;background:#0b0c0e;color:#eeeff2}.vecta-preview .header .menu,.vecta-preview .mobile-nav{display:none!important}.vecta-preview .header nav{display:flex!important}\n'
(out/'VECTAWEDDINGSDESKTOP10.css').write_text(css)
