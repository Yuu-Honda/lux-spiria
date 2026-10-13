"""Ensure migration preserves original research bytes and every former page route."""
from pathlib import Path
import json,hashlib,unittest
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
ARCHIVE=ROOT/'history/pre-site-migration-2026-10-13'
class Redirect(HTMLParser):
 def __init__(self,p):super().__init__();self.destination=None;self.canonical=None;self.fallback=False;self.feed(p.read_text())
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='meta' and a.get('name')=='site-destination':self.destination=a['content']
  if t=='link' and a.get('rel')=='canonical':self.canonical=a['href']
  if t=='meta' and a.get('http-equiv')=='refresh':self.fallback=True
class Migration(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.m=json.loads((ARCHIVE/'MANIFEST.json').read_text())
 def test_original_site_snapshot_exact(self):
  for f in self.m['files']:
   self.assertEqual(hashlib.sha256((ARCHIVE/f['path']).read_bytes()).hexdigest(),f['source_sha256'],f['path'])
 def test_original_research_documents_unchanged(self):
  for p,h in self.m['research_record_sha256'].items():self.assertEqual(hashlib.sha256((ROOT/p).read_bytes()).hexdigest(),h,p)
 def test_old_html_routes_redirect_to_matching_pages(self):
  for f in self.m['files']:
   path=f['path']
   if not path.endswith('.html') or path.startswith('history/'):continue
   doc=Redirect(ROOT/path);expected=self.m['new_site']+('' if path=='index.html' else path)
   self.assertEqual(doc.destination,expected,path);self.assertEqual(doc.canonical,expected,path);self.assertTrue(doc.fallback,path)
 def test_prior_history_still_exact(self):
  for f in self.m['files']:
   if f['path'].startswith('history/'):self.assertEqual(hashlib.sha256((ROOT/f['path']).read_bytes()).hexdigest(),f['source_sha256'])
if __name__=='__main__':unittest.main()
