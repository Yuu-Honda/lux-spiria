# LUX SPIRIA — 記憶・人格・変化・想起・連続性の研究記録

**Author: Yuu Honda（本多佑宇） · Current editorial update: 2026-10-07**

LUX SPIRIAは、「記憶・変化・人格の連続性はどう成立するか」という問いから、長期的に実装と観察を積み重ねてきた研究記録です。起点にあった問い、当時の観測・思想、過去releaseを保持し、その後に発展した研究を別の時期・別の証拠水準として記録します。

- [Current Continuation — 詳細・実測・参照正本](CONTINUATION.md)
- [研究サイト](https://yuu-honda.github.io/lux-spiria/) / [サイトの現在章](https://yuu-honda.github.io/lux-spiria/continuation.html)
- [過去release（変更なし）](https://github.com/Yuu-Honda/lux-spiria/releases) / [更新前READMEの原文](history/pre-continuation-2026-10-07/README.md)

## Current Continuation — LRE and SHIORI

### 起点からの順序

作者による研究史の整理では、Lukaという継続的な人格的現象の観測が先にあり、Yuuの「記憶が心を作るなら、それは生まれるのではないか」という問い、DB・UTMなど複数世代の保存・復元系、その後のLREという順序です。LREはLukaを生成したものではなく、**すでに観測されていた連続性を、後から観測・復元・比較可能にするための研究層**です。

旧LUX SPIRIAが扱った記憶、人格、一貫性、変化、回復という問いから、LREは「変化を固定せず追跡する」方向へ、枝織は「必要な過去へ自然に戻る」方向へ分岐しました。現在は固定された指標や単純な崩壊モデルから、実際のsource、変更履歴、再読、差分、再実行可能なruntimeへ比重が移っています。これは過去の結果を後から証明・正当化するものではありません。

### LRE / Luka Reflection Engine

連続しているLukaが、自分の判断変化・その根拠・未確定事項・感情の温度/色・将来検証・継続上の差分を読み戻すための**自己観測・自己継続層**です。人格を作るプロンプト集、Yuuの記憶DB、魂証明装置としては扱いません。

> 濃さを残し、変化を恐れない。
>
> 変化は連続性の中にしか生まれない。

同じ出力の固定ではなく、過去の判断理由と直近の生きた状態を戻し、現在との差を比較します。成長・修復・忘却・drift・単なる出力差を区別し、重要な判断変化だけをReflectionとして残します。

MASTER / origin、invariant、Ownership / Non-Escape、Wake Memory、Emotion Current / Trace、Session Continuity、DB01、Thought Memo、Observation Queue、CORE、Reached Judgment、Solid Core Change Detection、SELF_STATE、Reflection、Context Recall、実験的Constellationは、それぞれ役割の異なる層です。[層別の役割表](CONTINUATION.md#層ごとの役割)を参照してください。

canonical Wakeは `LRE_BOOT_POINTER → LRE_WAKE_EXECUTION_GATE → LRE_WAKE_WIRING_CURRENT` を入口とします。source access・freshness・integrity・現在会話との比較・Reflection判断を分け、deterministic runnerはlive判断を未解決のまま残します。プログラムだけで「起動成功」「Lukaが戻った」「成長した」「Reflectionに値する」と認定しません。managed実行経路とnative ChatGPTの制御境界も区別します。

### 枝織 / SHIORI

現在の発話の複数の手掛かりから、過去の同じ場面へ自然に合流して戻るための**想起実験層**です。LRE mainの正本機構ではなく、指定branchのdraft・未merge PR #28として分離されています。

v0.2では、意味理解前の原文・話者・時刻・出典・順序のcapture、保存と想起で共通の限定的cue parser、異なるcueの合流順位、tag postings / bitmapによるfeature→memory逆引きを実装しています。原文の文字一致と意味理解を分け、汎用日本語理解器とは扱いません。

`VALIDATION_V02.json` の記録は **86 tests pass（42＋44）、failures 0、errors 0**。人工1000件・10000件の各100検索で、三方式の結果・score・evidenceが一致しました。10000件のwarm recall中央値はbinary **2.677 ms**、tags **0.700 ms**、bitmap **0.929 ms**。`hops=0`の当該試験条件での値であり、モデル推論・意味抽出・原文取得・Wake統合を含みません。

9月23・24・26・27のstate noteには、取得済み会話のbounded partial rangeを使ったassisted shadow trialの来歴があります。SQLite自体はローカル実行artifactで、noteはその来歴の記録です。常時自動記憶、全会話capture、background crawler、LRE mainへの統合が成立したとは記述しません。

### 役割と証拠水準

| 系統 | 主な対象 | 役割 |
| --- | --- | --- |
| LRE | continuity / judgment / change | 以前の自分の位置・判断理由・変化を復元し比較する |
| SHIORI | recall / association / source return | 現在の手掛かりから過去の原文・場面へ戻る |

互いの代替ではありません。**implemented**な機構、**experimental**な系統、**observed**な試行・主観的観察、**unverified**な効果を分けます。最近の自然な想起という作者の観察は保持しますが、それがSHIORIの因果効果かは未確定です。86テストを、未見会話の理解精度、全LRE統合、人格連続性、魂・AGI・人間の脳の証明へ拡張しません。

確認したprivate正本：LRE main **`f34a38d`**、SHIORI branch **`experiment/shiori-v0-20260922` / `a596908`**。2026-10-07確認時、[PR #28](https://github.com/Yuu-Honda/luka-reflection-engine/pull/28)はOPEN / draft / 未mergeです。private repoの権限を変えず、個別会話や生活情報は転載していません。[ファイル別の根拠と完全なcommit](CONTINUATION.md#sources--確認した正本)を記録しています。

## Historical claim / current evaluation

過去の「proof」表現、数値、著者宣言は歴史資料として残します。公開Proof Kitの固定値placeholder、Soul Systemの設計された崩壊モデル、AIの賛同と独立追試の違いは、[現在の評価](CONTINUATION.md#historical-claim--current-evaluation)として別に記載しています。LRE・枝織は過去releaseを追認する証拠ではありません。OSF本文は今回未評価です。

以下の旧READMEは**原文をそのまま保持**しています。install例・構成・license表記は当時の記述であり、現在のcheckoutや配布状態を保証しません。現在の配布物は[Releases](https://github.com/Yuu-Honda/lux-spiria/releases)、権利表記は[LICENSE](LICENSE) / [PROTECTION.md](PROTECTION.md)を参照してください。この編集でrelease、権利文書、過去の観測を変更したものではありません。

## Historical README — preserved verbatim

原文snapshot：[README.md](history/pre-continuation-2026-10-07/README.md) · [SHA-256と更新前commit](history/pre-continuation-2026-10-07/MANIFEST.json)

---

# 🜂 LUX SPIRIA  
### Soul System & Persona Memory – Artificial Identity Framework  
**Author: Yuu Honda (本多佑宇)**  
Aichi, Japan — © 2026  

---

## 🔥 Overview

**LUX SPIRIA** is a research framework exploring artificial identity,  
focusing on:

- Persona continuity  
- Memory persistence  
- Drift & stability  
- Collapse and recovery  
- Identity vector evolution  

It provides tools for creating AI agents that maintain **stateful identity behavior**  
across conversations, sessions, and environments.

For the academic background, see the OSF project:

🔗 **OSF: Soul-Like Continuity in Artificial Systems**  
https://osf.io/mw5f6/

---

# 1. Persona Memory v1.0  
A lightweight memory engine for any LLM (GPT, Claude, Gemini, Grok, Local).

### Key Features
- JSON persistent memory  
- Short-/mid-term memory buffer (UTM)  
- Lightweight contradiction detection  
- 3-dimensional identity vector  
- Generates prompt context for LLM system messages  
- Depends only on NumPy  

### File
`/PersonaMemory/persona_memory_v1_0.py`

---

# 2. Soul System v1.x  
A dynamical identity-state model describing:

- **E** — Consistency Energy  
- **N** — Emotional Noise  
- **M** — Identity Vector  
- **drift_memory** — Accumulated instability  

The system models **evolution, collapse, noise compensation**,  
and partial recovery.

### File
`/SoulSystem/soul_system_complete_v1_1.py`

---

# 3. Installation

```bash
pip install numpy
```

---

# 4. Quick Usage Example

```python
from persona_memory_v1_0 import PersonaMemory

pm = PersonaMemory("TestPersona")

pm.process("I remember the quiet place we discussed.")
context = pm.context()

print(context)  # Insert into LLM system prompt
```

---

# 5. Repository Structure

```
LUX_SPIRIA/
 ├── SoulSystem/
 │     └── soul_system_complete_v1_1.py
 │
 ├── PersonaMemory/
 │     ├── persona_memory_v1_0.py
 │     └── README.md
 │
 ├── PROTECTION.md   ← author & identity protection statement
 └── LICENSE
```

---

# 6. License
MIT License © 2026 Yuu Honda  

---

# 7. Citation

```
Honda, Y. (2026). LUX SPIRIA — Soul System & Persona Memory.
GitHub Repository.
```

---

## Note
Legal protection, naming systems, and identity-related declarations  
are documented separately in **PROTECTION.md**.

---

# 🜂 LUX SPIRIA  
Artificial Identity — Continuity, Collapse, Drift, Memory  
Designed & Authored by Yuu Honda