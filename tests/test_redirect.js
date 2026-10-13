/* Exercise the actual browser redirect script with preserved query and section. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'history/pre-site-migration-2026-10-13/MANIFEST.json'), 'utf8'));
const script = fs.readFileSync(path.join(root, 'site-redirect.js'), 'utf8');
let checked = 0;
for (const item of manifest.files) {
  if (!item.path.endsWith('.html') || item.path.startsWith('history/')) continue;
  const html = fs.readFileSync(path.join(root,item.path),'utf8');
  const content = html.match(/name="site-destination" content="([^"]+)"/)[1];
  let replaced;
  const link = {href:content};
  vm.runInNewContext(script, {URL,document:{querySelector:()=>({content}),querySelectorAll:()=>[link]},window:{location:{search:'?view=record',hash:'#emotion-snapshot',replace:v=>{replaced=v;}}}});
  assert.equal(replaced,content+'?view=record#emotion-snapshot');
  assert.equal(link.href,replaced);
  checked++;
}
let unsafeRedirect = false;
vm.runInNewContext(script,{URL,document:{querySelector:()=>({content:'https://example.com/'})},window:{location:{replace:()=>{unsafeRedirect=true;}}}});
assert.equal(unsafeRedirect,false);
console.log(`${checked} old page routes preserve query/fragment; destination restricted to migrated site.`);
