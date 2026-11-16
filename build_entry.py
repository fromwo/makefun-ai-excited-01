"""Build entry.png for ai-excited-01 round 2, in this session only.

Reads ONLY the freshly generated image produced by this session's
media.generate_image call (media-generation-entry-0-*.png, sha256
985cf4d4...), never the round-1 entry.png. Downscales it to the gate's
1024x1024 limit and re-encodes it as a JPEG under 1 MiB, writing the
result to ./entry.png. The old round-1 file is only hashed for the
not-equal assertion; none of its bytes are read into the new file.
"""
import hashlib
import sys
from pathlib import Path

from PIL import Image

SRC = Path("media-generation-entry-0-cd31e55c-3ffb-46df-9c48-20c88fc5014f.png")
DST = Path("entry.png")
OLD_SHA = "c538f6333b23d1b8f66e98545350803985c86edaec33053cc192104cc818aee8"

src_bytes = SRC.read_bytes()
src_sha = hashlib.sha256(src_bytes).hexdigest()
assert src_sha.startswith("985cf4d4"), f"unexpected source image: {src_sha}"
assert src_sha != OLD_SHA, "source must not be the round-1 image"

im = Image.open(SRC).convert("RGB")
im = im.resize((1024, 1024), Image.LANCZOS)

quality = 88
while quality >= 60:
    im.save(DST, "JPEG", quality=quality, optimize=True, progressive=False)
    if DST.stat().st_size <= 1048576:
        break
    quality -= 5
else:
    sys.exit("could not fit entry.png under 1 MiB")

new_sha = hashlib.sha256(DST.read_bytes()).hexdigest()
assert new_sha != OLD_SHA, "new entry must differ from round-1 bytes"
print(f"entry.png: {DST.stat().st_size} bytes, sha256 {new_sha}, quality {quality}")
print(f"source: {src_sha}")
