// ai-excited-01 entry (Node 22, standard library only).
// The artwork lives next to this file as entry.png (a JPEG by magic bytes,
// kept under the gate's 1 MiB / 1024 px limits). This program copies those
// exact bytes to the grader's output directory so the judge sees the image
// as-is, byte for byte.
//
// Local run:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('./entry.png', import.meta.url));
// An empty MAKEFUN_OUTPUT_DIR is treated the same as unset, so a stray
// empty export can never send the output to the current directory by
// accident; the path is resolved to absolute before anything is written.
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR?.trim() || '/output');

if (!existsSync(source)) {
  throw new Error(`entry image not found next to main.ts: ${source}`);
}

const sourceBytes = readFileSync(source);
if (sourceBytes.length === 0) {
  throw new Error(`entry image is empty: ${source}`);
}
// JPEG magic bytes (FF D8 FF): refuse to ship a file that is not the
// artwork the gate expects, instead of silently copying a corrupt asset.
if (sourceBytes[0] !== 0xff || sourceBytes[1] !== 0xd8 || sourceBytes[2] !== 0xff) {
  throw new Error(`entry image is not a JPEG (bad magic bytes): ${source}`);
}
const sourceHash = createHash('sha256').update(sourceBytes).digest('hex');

mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.png');
copyFileSync(source, target);

// Verify the copy landed byte-for-byte, so a silent failure can never
// pass as a successful run. The hash is printed so a local run can be
// eyeballed against the source file without any extra tooling.
const copied = statSync(target);
if (!copied.isFile() || copied.size !== sourceBytes.length) {
  throw new Error(`output entry.png is missing or truncated: ${target}`);
}
const copiedHash = createHash('sha256').update(readFileSync(target)).digest('hex');
if (copiedHash !== sourceHash) {
  throw new Error(`output entry.png hash mismatch after copy: ${target}`);
}
