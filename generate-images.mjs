// Generates all photographic assets for THE MEDISPA via OpenAI gpt-image-2.
// gpt-image-1 is forbidden in this project. No fallback. If gpt-image-2 errors,
// the script aborts.

import OpenAI from "openai";
import { writeFile, access, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "images");
const MODEL = "gpt-image-2";

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error(
    "Missing OPENAI_API_KEY. Export it first:\n  export OPENAI_API_KEY=sk-...",
  );
  process.exit(1);
}

const client = new OpenAI({ apiKey: API_KEY });

const STYLE_NOTE =
  "Editorial luxury aesthetic. Warm cream and beige tones, soft natural daylight, clean composition, premium magazine photography. No text, no logos, no watermarks. Photographic realism, shallow depth of field where appropriate. Color palette: warm cream, beige, soft taupe, ivory.";

const ASSETS = [
  {
    file: "hero-portrait.jpg",
    size: "1024x1536",
    prompt: `Editorial portrait of a young woman in her late 20s with warm olive skin, dark hair pulled back into a low bun, bare shoulders, looking gently over her shoulder toward camera, calm serene expression, no makeup look with a healthy glow. Studio lit with soft daylight from a large window. Plain warm cream background. Shallow depth of field, sharp on the eyes. Half-body crop. ${STYLE_NOTE}`,
  },
  {
    file: "hero-interior.jpg",
    size: "1024x1536",
    prompt: `Interior of a luxury Melbourne medispa inside a heritage building. A pair of tall arched windows on the right with sheer light. A modernist sputnik chandelier with frosted glass globes hangs from a high white ceiling. Pale blonde-oak parquet floor. Smooth curved white plaster walls. A single small ornamental tree in a tall planter on the floor. Empty, calm, uncluttered. Soft afternoon daylight. Wide vertical shot. ${STYLE_NOTE}`,
  },
  {
    file: "card-face.jpg",
    size: "1024x1024",
    prompt: `Close-up beauty shot of a young woman with healthy glowing skin, eyes gently closed, head tilted up, fingertips lightly touching her cheekbone as if applying serum. Warm beige seamless backdrop. Soft golden daylight from one side. Sharp on lashes and cheekbone. Half-face crop, nose to hair. ${STYLE_NOTE}`,
  },
  {
    file: "card-skin.jpg",
    size: "1024x1024",
    prompt: `Macro photograph of a swirl of luxurious creamy ivory skincare lotion with a glossy peak, against a warm beige background. Smooth ribbons and folds, single highlight. No container, no text, no hands. Hero product texture shot. ${STYLE_NOTE}`,
  },
  {
    file: "card-body.jpg",
    size: "1024x1024",
    prompt: `Editorial cropped photograph of a woman's bare shoulder and upper back, gracefully draped in a soft cream silk robe loosely off the shoulder. Smooth skin tone, soft daylight from one side, plain warm beige backdrop. Tasteful, modest, no face, no logos, hero spa imagery. ${STYLE_NOTE}`,
  },
  {
    file: "about-interior.jpg",
    size: "1536x1024",
    prompt: `Wide horizontal interior of a luxury heritage Melbourne medispa. Two tall arched windows on the left letting in soft daylight, sheer curtains. A modernist sputnik chandelier with frosted glass globes overhead. Pale blonde-oak parquet flooring. Curved white plaster walls. Two cream upholstered armchairs and a small round side table on the right. A staircase glimpsed in the background. Calm, serene, empty. ${STYLE_NOTE}`,
  },
  {
    file: "about-vase.jpg",
    size: "1024x1024",
    prompt: `Minimal still life. A single olive branch with a few leaves arranged loosely in a small white matte ceramic bud vase, standing on a recessed shelf carved into a smooth warm beige plaster wall. Soft diffused daylight casts a gentle shadow. Empty negative space around. ${STYLE_NOTE}`,
  },
  {
    file: "testimonial-interior.jpg",
    size: "1536x1024",
    prompt: `Calm interior vignette. A round frameless mirror mounted on a warm beige plaster wall, above a slim cream console table. On the table: a small ceramic vase with a single sprig of greenery, two small stacked hardcover books, a tiny glass diffuser. Soft daylight, no people. Wide horizontal framing with the console centered. ${STYLE_NOTE}`,
  },
  {
    file: "visit-interior.jpg",
    size: "1024x1280",
    prompt: `Vertical interior shot of the same heritage Melbourne medispa, looking through an internal opening. A tall arched window in the distance with soft daylight, modernist sputnik chandelier overhead, pale oak floor, smooth curved white plaster walls. Empty, serene, architectural. ${STYLE_NOTE}`,
  },
  {
    file: "map.png",
    size: "1024x1024",
    prompt: `Stylised minimalist map illustration of a Melbourne neighbourhood (Brunswick West). Light cream background, pale grey street lines of varying weights forming a clean orthogonal grid with a few diagonal streets, a small rectangular park outlined in soft sage green, a thin grey rail line crossing diagonally. A single subtle taupe location pin marker placed slightly right of center. Flat vector design feel, no text labels visible, no logos. Generous white space. Premium editorial cartography style.`,
  },
  {
    file: "product-zo.png",
    size: "1024x1536",
    prompt: `Studio product shot of a tall slim cylindrical airless skincare pump bottle. Glossy white plastic body with a brushed silver collar and a low-profile white pump cap. Standing upright, perfectly centered, on a pale cream seamless background with a soft shadow at the base. Hero pack-shot lighting from above and slightly left. No text, no logos visible, label area smooth white. ${STYLE_NOTE}`,
  },
  {
    file: "product-neocutis.png",
    size: "1024x1536",
    prompt: `Studio product shot of a sleek metallic silver skincare pump bottle, slim cylindrical shape, brushed metal finish all over with a matte silver pump cap. Standing upright, perfectly centered, on a pale cream seamless background with a soft shadow at the base. Hero pack-shot. No text, no logos visible. ${STYLE_NOTE}`,
  },
  {
    file: "product-skinceuticals.png",
    size: "1024x1536",
    prompt: `Studio product shot of an amber-brown glass dropper bottle, classic apothecary serum shape, with a black cylindrical dropper cap. Standing upright, perfectly centered, on a pale cream seamless background with a soft shadow at the base. Hero pack-shot lighting. No text, no logos visible, blank label area on the front. ${STYLE_NOTE}`,
  },
  {
    file: "product-alastin.png",
    size: "1024x1536",
    prompt: `Studio product shot of a slim white skincare pump bottle, soft matte white plastic body with subtle silver banding around the neck and a low white pump cap. Standing upright, perfectly centered, on a pale cream seamless background with a soft shadow at the base. Hero pack-shot. No text, no logos visible. ${STYLE_NOTE}`,
  },
  {
    file: "product-is-clinical.png",
    size: "1024x1536",
    prompt: `Studio product shot of a deep cobalt blue glossy plastic pump bottle, tall slim cylinder, with a small silver collar and a matching cobalt blue pump cap. Standing upright, perfectly centered, on a pale cream seamless background with a soft shadow at the base. Hero pack-shot. No text, no logos visible. ${STYLE_NOTE}`,
  },
];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function generate({ file, size, prompt }) {
  const out = join(OUT_DIR, file);
  if (await exists(out)) {
    console.log(`  · skip   ${file} (exists)`);
    return;
  }
  const t0 = Date.now();
  console.log(`  ↻ start  ${file} (${size})`);
  const res = await client.images.generate({
    model: MODEL,
    prompt,
    size,
    quality: "high",
    n: 1,
  });
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error(`no b64_json in response for ${file}`);
  await writeFile(out, Buffer.from(b64, "base64"));
  console.log(`  ✓ done   ${file} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Generating ${ASSETS.length} assets with model "${MODEL}"`);
  console.log(`Output: ${OUT_DIR}\n`);

  for (const asset of ASSETS) {
    try {
      await generate(asset);
    } catch (err) {
      console.error(`\nFAILED on ${asset.file}:`);
      console.error(err?.message || err);
      if (
        err?.status === 404 ||
        /model.*not.*found/i.test(err?.message || "") ||
        /unsupported/i.test(err?.message || "")
      ) {
        console.error(
          `\nModel "${MODEL}" appears unsupported. Per project rules, gpt-image-1 is forbidden as a fallback. Aborting.`,
        );
        process.exit(2);
      }
      throw err;
    }
  }
  console.log("\nAll assets generated.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
