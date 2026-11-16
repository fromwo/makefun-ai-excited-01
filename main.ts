// ai-excited-01 entry (Node 22, standard library only).
// The artwork lives next to this file as entry.png (a JPEG by magic bytes,
// kept under the gate's 1 MiB / 1024 px limits). This program copies those
// exact bytes to the grader's output directory so the judge sees the image
// as-is, byte for byte.
//
// Local run:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('./entry.png', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

if (!existsSync(source)) {
  throw new Error(`entry image not found next to main.ts: ${source}`);
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.png');
copyFileSync(source, target);

// Verify the copy landed and is non-empty, so a silent failure can never
// pass as a successful run.
const copied = statSync(target);
if (!copied.isFile() || copied.size === 0) {
  throw new Error(`output entry.png is missing or empty: ${target}`);
}
