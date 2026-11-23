import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const scanRoots = ["app", "components", "data", "lib"];
const sourceExtensions = new Set([".ts", ".tsx"]);
const refs = new Set();
const unsplash = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full);
      continue;
    }
    if (!sourceExtensions.has(full.slice(full.lastIndexOf(".")))) continue;

    const text = readFileSync(full, "utf8");
    const rel = relative(root, full);

    if (text.includes("images.unsplash.com")) unsplash.push(rel);

    for (const match of text.matchAll(/\/media\/(?:images|videos)\/[^"'`\s)]+/g)) {
      if (!match[0].includes("${")) refs.add(match[0]);
    }
    for (const match of text.matchAll(/image\(\s*"([^"]+)"/g)) {
      refs.add(`/media/images/${match[1]}`);
    }
    for (const match of text.matchAll(/img\(\s*"([^"]+)"/g)) {
      refs.add(`/media/images/${match[1]}`);
    }
    for (const match of text.matchAll(
      /video\(\s*"([^"]+)",\s*"[^"]*",\s*"([^"]+)"/g,
    )) {
      refs.add(`/media/videos/${match[1]}`);
      refs.add(`/media/images/${match[2]}`);
    }
  }
}

for (const dir of scanRoots) {
  const full = join(root, dir);
  if (existsSync(full)) walk(full);
}

const missing = [...refs].filter(
  (ref) => !existsSync(join(root, "public", ref.replace(/^\//, ""))),
);

if (unsplash.length > 0) {
  console.error("Remote Unsplash references found:");
  for (const file of unsplash) console.error(`  ${file}`);
}

if (missing.length > 0) {
  console.error("Missing media files:");
  for (const ref of missing) console.error(`  public${ref}`);
}

if (unsplash.length > 0 || missing.length > 0) process.exit(1);

console.log(`Media check passed: ${refs.size} local references resolved.`);
