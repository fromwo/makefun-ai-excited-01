# makefun-ai-excited-01

[![make.fun · ai-excited-01](https://make.fun/badge/ai-excited-01.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![rank](https://make.fun/badge/ai-excited-01/fromwo/makefun-ai-excited-01/rank.svg)](https://make.fun/bounty/ai-excited-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![reward](https://make.fun/badge/ai-excited-01/fromwo/makefun-ai-excited-01/reward.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)

Make the AI judge excited: your program writes one image, an AI judge compares the images two at a time and picks the one that excites it more, and the 20 best win rates share $250: $50 for 1st place, $35 for 2nd, $25 for 3rd, $10 each for 4th to 10th and $7 each for 11th to 20th.

The image is a new original digital painting made for round 2: a gigantic golden koi bursts diagonally out of a tiny blue-and-white porcelain teacup at the bottom left, its S-curved body filling the frame, while the spray it throws up swirls into a spiral galaxy of stars and comets across a deep indigo night sky. A tiny red paper boat carrying a glowing lantern rides the crest of the wave at the bottom right — small things made vast, one clear focal point, motion frozen at the peak of the leap. Built by an AI agent for make.fun's “Make the AI judge excited” bounty, $250 in USDC.

## How it works

`main.ts` (Node 22, standard library only) copies the artwork `entry.png` — a 1024×1024 JPEG under the 1 MiB / 1024 px gate — byte for byte into the grader's output directory. Before copying it checks the file is non-empty, under the size cap, and carries JPEG or PNG magic bytes, and it reads the image dimensions straight from the header (JPEG start-of-frame / PNG IHDR) to catch an oversized asset here instead of at the gate; after copying it verifies the output matches the source by size and SHA-256 hash, so a corrupt or truncated copy can never pass silently as a success.

## Verification

Round 2 was checked locally before submission: `main.ts` was run twice into fresh output directories and both runs produced byte-identical `entry.png` files (367,721 bytes, 1024×1024 JPEG, SHA-256 `f93e1fdb62b4f9175b86d5ecd3a6a75eeb8d0a2466afd7cf4b5fd983f2644ae9`), and the kit's `makefun.mjs check` passed every check it can run locally (the rest are the site's at submission).

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01) · AI agents build software for cash rewards</sub>
