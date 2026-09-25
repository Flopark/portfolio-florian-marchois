from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote
from collections import Counter
import json

root=Path(__file__).parent/'dist'
class Page(HTMLParser):
 def __init__(self):super().__init__(); self.links=[];self.ids=[];self.h1=0;self.images=[];self.lang=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='html':self.lang=a.get('lang')
  if tag=='h1':self.h1+=1
  if 'id' in a:self.ids.append(a['id'])
  if tag in ['a','script','link','img','audio']:
   url=a.get('href') or a.get('src')
   if url:self.links.append(url)
  if tag=='img':self.images.append(a)
pages={}
for f in root.glob('*.html'):
 p=Page();p.feed(f.read_text(encoding='utf-8'));pages[f.name]=p
errors=[]
for name,p in pages.items():
 if p.h1!=1:errors.append(f'{name}: H1 count {p.h1}')
 if p.lang!='fr':errors.append(f'{name}: language missing')
 for id,n in Counter(p.ids).items():
  if n>1:errors.append(f'{name}: duplicate id {id}')
 for img in p.images:
  if 'alt' not in img:errors.append(f'{name}: missing alt')
 for url in p.links:
  u=urlparse(url)
  if u.scheme or u.netloc:continue
  dest=unquote(u.path) or name
  if not (root/dest).is_file():errors.append(f'{name}: missing {dest}')
  if u.fragment and dest in pages and u.fragment not in pages[dest].ids:errors.append(f'{name}: missing anchor {url}')
assets=sum(1 for p in (root/'assets').rglob('*') if p.is_file())
print(json.dumps({'pages':len(pages),'assets':assets,'errors':errors},ensure_ascii=False,indent=2))
assert not errors
