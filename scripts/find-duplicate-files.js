#!/usr/bin/env node
/**
 * find-duplicate-files.js
 *
 * Traverses every sub-folder of ./vaults and reports any file-name (note or asset)
 * that appears in more than one vault.  Case-insensitive by default.
 *
 * To change behaviour, tweak the CONFIG section.
 */

import { promises as fs } from "fs";
import path from "path";

//////////////////// CONFIG ////////////////////
const ROOT_DIR   = path.resolve("../Nexus");   // folder that holds the individual vaults
const IGNORE_EXT = [ ".DS_Store", ".git", ".obsidian" ];  // add extensions or folders to ignore
const CASE_INSENSITIVE = true;               // treat “Note.md” and “note.md” as the same
///////////////////////////////////////////////

const seen = new Map();   // key: name, value: array of full paths

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      if (!IGNORE_EXT.includes(e.name)) await walk(path.join(dir, e.name));
    } else {
      const ext = path.extname(e.name);
      if (IGNORE_EXT.includes(ext)) continue;
      const key = CASE_INSENSITIVE ? e.name.toLowerCase() : e.name;
      const full = path.join(dir, e.name);
      seen.has(key) ? seen.get(key).push(full) : seen.set(key, [full]);
    }
  }
}

(async () => {
  await walk(ROOT_DIR);

  const duplicates = [...seen.entries()].filter(([, paths]) => paths.length > 1);
  if (!duplicates.length) {
    console.log("🎉  No duplicate file names found across vaults.");
    return;
  }

  console.log(`⚠️  Found ${duplicates.length} duplicates:\n`);
  for (const [name, paths] of duplicates) {
    console.log(`— ${name}`);
    paths.forEach(p => console.log("   ", p.replace(ROOT_DIR + path.sep, "")));
  }
})();
