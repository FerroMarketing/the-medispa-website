# THE MEDISPA

Single-page static landing site. Heritage Melbourne medispa.

## Stack

Plain HTML + CSS + a tiny vanilla JS file. Imagery generated via OpenAI `gpt-image-2`.

## Setup

```bash
npm install
export OPENAI_API_KEY=sk-...    # org must be verified for gpt-image-2
node generate-images.mjs        # writes ~15 photos to ./images/
python3 -m http.server 4310
```

Open http://localhost:4310.

## Image regeneration

`generate-images.mjs` skips files that already exist. Delete the relevant file from `./images/` and re-run to regenerate just that asset. Model is locked to `gpt-image-2` with no fallback.

## Notes

- Product bottles are generic stand-ins. Replace with licensed brand renders before launch.
- The map graphic is a stylised illustration, not a real Google Map.
- Treatments / About / Shop / Contact are visual links only; no subpages.
