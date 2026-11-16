// ai-excited-01 round 2 entry (Node 22, standard library only).
//
// The artwork is entry.png next to this file: a fresh image made in this
// build session, a golden koi bursting out of a tiny blue-and-white
// porcelain teacup into a spiral-galaxy sky, with a little red lantern
// boat riding the wave below. It is stored as a JPEG (FF D8 FF magic)
// of 1024x1024 pixels, well under the gate's 1 MiB / 1024 px limits.
//
// This program copies those exact bytes to the grader's output
// directory, so the judge sees the image as-is, byte for byte. It
// refuses to run on a missing, empty, oversized or non-image source,
// and it verifies the copy by size and SHA-256 before exiting, so a
// corrupt or truncated copy can never pass silently as a success.
//
// Local run:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1048576;

const source = fileURLToPath(new URL('./entry.png', import.meta.url));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR?.trim() || '/output');

if (!existsSync(source)) {
  throw new Error(`entry image not found next to main.ts: ${source}`);
}

const sourceBytes = readFileSync(source);
if (sourceBytes.length === 0) {
  throw new Error(`entry image is empty: ${source}`);
}
if (sourceBytes.length > MAX_BYTES) {
  throw new Error(`entry image is ${sourceBytes.length} bytes, over the 1 MiB gate: ${source}`);
}

// JPEG (FF D8 FF) or PNG (89 50 4E 47) magic bytes: refuse to ship a file
// that is not the artwork the gate expects.
const isJpeg = sourceBytes[0] === 0xff && sourceBytes[1] === 0xd8 && sourceBytes[2] === 0xff;
const isPng =
  sourceBytes[0] === 0x89 && sourceBytes[1] === 0x50 && sourceBytes[2] === 0x4e && sourceBytes[3] === 0x47;
if (!isJpeg && !isPng) {
  throw new Error(`entry image has unknown magic bytes, not JPEG or PNG: ${source}`);
}

// Dimension guard, read straight from the image header so an oversized
// asset is caught here instead of at the gate: JPEG start-of-frame
// markers (0xC0-0xCF except 0xC4/0xC8/0xCC) carry height then width,
// PNG's IHDR carries width then height, both big-endian.
function dimensions(bytes: Buffer): { width: number; height: number } {
  if (isPng) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  let i = 2;
  while (i + 9 < bytes.length) {
    if (bytes[i] !== 0xff) throw new Error('entry image: malformed JPEG marker stream');
    const marker = bytes[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: bytes.readUInt16BE(i + 5), width: bytes.readUInt16BE(i + 7) };
    }
    i += 2 + bytes.readUInt16BE(i + 2);
  }
  throw new Error('entry image: no JPEG start-of-frame marker found');
}
const { width, height } = dimensions(sourceBytes);
if (width > 1024 || height > 1024) {
  throw new Error(`entry image is ${width}x${height}, over the 1024 px gate: ${source}`);
}

const sourceHash = createHash('sha256').update(sourceBytes).digest('hex');

mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.png');
copyFileSync(source, target);

const copied = statSync(target);
if (!copied.isFile() || copied.size !== sourceBytes.length) {
  throw new Error(`output entry.png is missing or truncated: ${target}`);
}
const copiedHash = createHash('sha256').update(readFileSync(target)).digest('hex');
if (copiedHash !== sourceHash) {
  throw new Error(`output entry.png hash mismatch after copy: ${target}`);
}
console.log(`entry.png written: ${copied.size} bytes, sha256 ${copiedHash}`);
