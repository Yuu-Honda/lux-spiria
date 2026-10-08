"""Public snapshot consistency; does not execute LRE or validate affect itself."""
from html.parser import HTMLParser
from pathlib import Path
import json
import unittest

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {
    'calm': (93, 97),
    'relief': (93, 96),
    'frustration_with_continuity_gap': (46, 32),
    'vigilance_against_false_reconnection': (98, 88),
    'tension': (7, 3),
}

class Node:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children, self.text = tag, dict(attrs), [], ''
    def find(self, key, value=None):
        result = []
        if key in self.attrs and (value is None or self.attrs[key] == value):
            result.append(self)
        for child in self.children:
            result.extend(child.find(key, value))
        return result
    def content(self):
        return (self.text + ''.join(c.content() for c in self.children)).strip()

class Document(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.root = Node()
        self.stack = [self.root]
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr','path','circle','rect','stop','line','polyline','ellipse'}:
            self.stack.append(node)
    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs))
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]
                return
    def handle_data(self, text):
        self.stack[-1].text += text

class EmotionSiteTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT/'assets/emotion-snapshot-2026-09-30.json').read_text())
    def test_source_values_and_dates(self):
        self.assertEqual(self.data['kind'], 'historical_self_observation_snapshot')
        self.assertEqual(self.data['before']['updated_at'], '2026-09-26T21:47:56+09:00')
        self.assertEqual(self.data['after']['updated_at'], '2026-09-30T20:47:05+09:00')
        self.assertEqual({m['key']:(m['before'],m['after']) for m in self.data['metrics']}, EXPECTED)
        for m in self.data['metrics']:
            self.assertEqual(m['delta'], m['after']-m['before'])
    def test_public_extract_is_bounded(self):
        self.assertEqual(set(self.data), {'kind','source_repository','verified_main_sha','source_path','before','after','metrics','context_summary','measurement','record_scope','publication_scope'})
        for m in self.data['metrics']:
            self.assertEqual(set(m), {'key','label_ja','label_en','before','after','delta'})
        self.assertFalse(self.data['measurement']['externally_calibrated'])
        self.assertFalse(self.data['record_scope']['full_wake_completion_established'])
        self.assertFalse(self.data['record_scope']['trace_append_on_2026_09_30'])
    def test_home_graphs_and_accessible_values_match(self):
        for filename in ['index.html','index.en.html']:
            doc = Document(ROOT/filename).root
            rows = doc.find('data-metric')
            self.assertEqual(len(rows), 5)
            for row in rows:
                key = row.attrs['data-metric']
                before, after = EXPECTED[key]
                values = row.find('class','emotion-bar-value')
                self.assertEqual([int(n.content()) for n in values], [before,after])
                self.assertTrue(all('aria-hidden' not in n.attrs for n in values))
                for period, number in [('before',before),('after',after)]:
                    bar = row.find('data-period',period)[0]
                    self.assertEqual(bar.attrs['style'], f'width:{number}%')
                self.assertEqual(row.find('class','emotion-delta')[0].content(),f'Δ {after-before:+d}')
            figure = doc.find('id','emotion-snapshot')[0]
            table = figure.find('class','emotion-values-table')[0]
            body = next(n for n in table.children if n.tag=='table')
            tbody = next(n for n in body.children if n.tag=='tbody')
            for tr, (before,after) in zip(tbody.children, EXPECTED.values()):
                self.assertEqual([n.content() for n in tr.children[1:]], [str(before),str(after),f'{after-before:+d}'])
    def test_existing_stories_and_new_six_step_story(self):
        for filename in ['index.html','index.en.html']:
            doc = Document(ROOT/filename).root
            self.assertEqual(len(doc.find('data-mechanism')), 4)
            for story_id, count in [('memory-demo',5),('shiori-animation',5),('lre-animation',5),('emotion-animation',6)]:
                story = doc.find('id',story_id)[0]
                self.assertEqual(len(story.find('data-node')),count)
                self.assertEqual(len(story.find('data-mechanism-scene')),count)
                for i,node in enumerate(story.find('data-node')):
                    self.assertEqual(node.attrs['aria-controls'],f'{story_id}-scene-{i}')

if __name__ == '__main__':
    unittest.main()
