"""Generate lighter public formats without changing the original assets."""
from pathlib import Path
from PIL import Image
root=Path(__file__).parent/'dist/assets'
before=after=0
for path in root.glob('*.jpg'):
 if path.stem.startswith('mode-'):continue
 target=path.with_suffix('.webp')
 with Image.open(path) as image:
  image.thumbnail((1600,1600))
  image.convert('RGB').save(target,'WEBP',quality=83,method=6)
 before+=path.stat().st_size
 after+=target.stat().st_size
print(f'Images: {before:,} -> {after:,} bytes; originals preserved.')
