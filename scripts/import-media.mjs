import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const mapPath = path.join(root, "scripts/media-map.json");
const outputRoot = path.join(root, "public/media");
const imagesDir = path.join(outputRoot, "images");
const videosDir = path.join(outputRoot, "videos");

const map = JSON.parse(await readFile(mapPath, "utf8"));
const sourceDir = path.resolve(map.sourceDir);

const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");
const relative = (file) => path.relative(outputRoot, file).split(path.sep).join("/");

await mkdir(imagesDir, { recursive: true });
await mkdir(videosDir, { recursive: true });

const sourceCache = new Map();
const outputs = new Map();
const excluded = map.excluded ?? [];

for (const entry of map.images) {
  const sourcePath = path.join(sourceDir, entry.source);
  const outputPath = path.join(imagesDir, entry.output);

  if (outputs.has(outputPath)) {
    throw new Error(`Duplicate output in media map: ${entry.output}`);
  }

  let input = sourceCache.get(sourcePath);
  if (!input) {
    input = await readFile(sourcePath);
    sourceCache.set(sourcePath, input);
  }

  const hash = sha256(input);
  const pipeline = sharp(input, { failOn: "none" }).rotate();

  if (entry.fit === "cover" && entry.width && entry.height) {
    pipeline.resize(entry.width, entry.height, {
      fit: "cover",
      position: "centre",
      withoutEnlargement: false,
    });
  } else {
    pipeline.resize({
      width: entry.width ?? 2000,
      height: entry.height ?? 2000,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  const info = await pipeline
    .jpeg({ quality: entry.quality ?? 82, mozjpeg: true })
    .toFile(outputPath);

  outputs.set(outputPath, {
    source: entry.source,
    output: relative(outputPath),
    alt: entry.alt,
    sha256: hash,
    width: info.width,
    height: info.height,
    bytes: info.size,
  });

  console.log(`image  ${entry.output}  ${info.width}x${info.height}  ${info.size} bytes`);
}

const placeholderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${map.placeholder.width}" height="${map.placeholder.height}" viewBox="0 0 ${map.placeholder.width} ${map.placeholder.height}">
  <defs>
    <pattern id="ribs" width="44" height="44" patternUnits="userSpaceOnUse">
      <rect width="44" height="44" fill="#151713"/>
      <rect width="2" height="44" fill="#efe9de" fill-opacity="0.045"/>
    </pattern>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0a0b09" stop-opacity="0.9"/>
      <stop offset="0.7" stop-color="#0a0b09" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#0a0b09" stop-opacity="0.8"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#ribs)"/>
  <rect width="100%" height="100%" fill="url(#fade)"/>
  <rect x="72" y="72" width="${map.placeholder.width - 144}" height="${map.placeholder.height - 144}" fill="none" stroke="#efe9de" stroke-opacity="0.14"/>
  <rect x="72" y="72" width="12" height="132" fill="#f4511e"/>
  <text x="124" y="150" fill="#efe9de" font-family="Helvetica, Arial, sans-serif" font-size="26" letter-spacing="7">VAL CONTAINERS</text>
  <text x="124" y="510" fill="#efe9de" font-family="Helvetica, Arial, sans-serif" font-size="88" font-weight="700" letter-spacing="-2">Photos coming soon</text>
  <text x="124" y="582" fill="#efe9de" fill-opacity="0.58" font-family="Helvetica, Arial, sans-serif" font-size="30">This unit is in the yard. Ask for current photos</text>
  <text x="124" y="626" fill="#efe9de" fill-opacity="0.58" font-family="Helvetica, Arial, sans-serif" font-size="30">and the inspection sheet for the exact container.</text>
  <text x="124" y="1032" fill="#f4511e" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="4">NAIROBI YARD · COUNTRYWIDE DELIVERY</text>
  <g transform="translate(1080 350)" fill="none" stroke="#efe9de" stroke-opacity="0.2" stroke-width="4">
    <rect x="0" y="0" width="330" height="250"/>
    <path d="M55 0v250M110 0v250M165 0v250M220 0v250M275 0v250"/>
    <rect x="330" y="35" width="80" height="215"/>
  </g>
</svg>`;

const placeholderPath = path.join(imagesDir, map.placeholder.output);
const placeholderInfo = await sharp(Buffer.from(placeholderSvg))
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(placeholderPath);

outputs.set(placeholderPath, {
  source: "generated",
  output: relative(placeholderPath),
  alt: "Photos coming soon — ask the yard for current photos of this unit",
  sha256: null,
  width: placeholderInfo.width,
  height: placeholderInfo.height,
  bytes: placeholderInfo.size,
});

console.log(
  `image  ${map.placeholder.output}  ${placeholderInfo.width}x${placeholderInfo.height}  ${placeholderInfo.size} bytes`,
);

const videoSource = path.join(sourceDir, map.video.source);
const videoOutput = path.join(videosDir, path.basename(map.video.output));
await mkdir(path.dirname(videoOutput), { recursive: true });
await copyFile(videoSource, videoOutput);
const videoStat = await stat(videoOutput);
const videoBytes = await readFile(videoSource);

console.log(`video  ${map.video.output}  ${videoStat.size} bytes`);

const manifest = {
  generatedAt: new Date().toISOString(),
  sourceDir,
  images: [...outputs.values()],
  video: {
    source: map.video.source,
    output: relative(videoOutput),
    sha256: sha256(videoBytes),
    bytes: videoStat.size,
  },
  excluded,
};

await writeFile(
  path.join(outputRoot, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`\nImported ${outputs.size} images and 1 video.`);
console.log(`Manifest: ${relative(path.join(outputRoot, "manifest.json"))}`);
