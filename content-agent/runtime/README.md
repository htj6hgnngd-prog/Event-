# VECTA Content Director runtime: photo selection

This is the executable photo-selection runner for the VECTA Content Director knowledge base. It calls a vision model for first-pass scoring, builds a shortlist, fetches full-resolution Yandex Disk originals for shortlisted files, and asks the model for a sequenced editorial set. It does **not** generate, retouch, recolor, or replace source photos and does not publish anything.

## Requirements

- Python 3.10+
- Install dependencies: pip install -r content-agent/runtime/requirements.txt
- An OpenAI API key available as OPENAI_API_KEY. Do not paste credentials into source files, prompts, or chat.
- A publicly accessible Yandex Disk share link, or a local folder of source images.

## Run on a Yandex Disk folder

From the repository root:

~~~bash
python content-agent/runtime/photo_selector.py \
  --yandex-url "https://disk.yandex.ru/d/17Td35jRISCUuQ" \
  --yandex-path "/JPEG" \
  --out "/path/to/vecta-output"
~~~

PowerShell example for the current terminal session:

~~~powershell
$env:OPENAI_API_KEY = "set this in your secret manager, not in source"
python content-agent/runtime/photo_selector.py --yandex-url "YOUR_PUBLIC_YANDEX_LINK" --yandex-path "/JPEG"
~~~

For local files:

~~~bash
python content-agent/runtime/photo_selector.py --input-dir "/path/to/photos" --out "./vecta-output"
~~~

Environment overrides:
- OPENAI_SCORE_MODEL default: gpt-4.1-mini
- OPENAI_FINAL_MODEL default: gpt-4.1

## Outputs

- all_sources.jpg: inventory contact sheet of every downloaded source preview.
- scores.json and ratings.csv: first-pass scores and evidence notes for each source image.
- candidate_sheet.jpg: shortlisted candidates.
- selection.json: final ordered selection, role per frame, visual thesis, cover alternatives, quality-gate verdict, and counts.
- selected_sequence.jpg: final contact sheet made only from selected source photos.
- originals/: full-resolution finalist downloads from Yandex Disk.

The first pass reviews all available images at preview resolution. The finalists are then downloaded from the source when possible and evaluated at higher resolution. If original downloads fail, the output records how many finalists were actually checked at full resolution. A verdict below the quality gate is not upgraded by hand: inspect the recorded failures and rerun after fixing the source or constraints.

The runner rejects filenames that do not match the supplied source list, reports when image downloads or model calls fail, and keeps exact source filenames in the selection. It does not claim that the model was fine-tuned; it executes the VECTA operating prompt and reference rules at inference time.

## Offline tests

~~~bash
python -m unittest discover -s content-agent/runtime/tests -v
~~~

No API call is made by the offline tests.
