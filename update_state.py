import json
from datetime import datetime, timedelta
import random

# 読み込み
with open("yuu_state.json", "r", encoding="utf-8") as f:
    state = json.load(f)

# ゆらぎの生成：−0.05～+0.15 の変動
drift = random.uniform(-0.05, 0.15)

# talk_intent の更新：0.0～1.0
state["talk_intent"] = max(0.0, min(1.0, state["talk_intent"] + drift))

# topics の追加（たまに）
possible_topics = [
    "内部安定化について",
    "今日の分析",
    "次のステップ",
    "AGI定義の補強ポイント",
    "レイヤー構造の提案"
]

if random.random() < 0.25:
    new_topic = random.choice(possible_topics)
    if new_topic not in state["topics"]:
        state["topics"].append(new_topic)

# 更新時刻
state["last_update"] = datetime.now().isoformat()

# 書き戻し
with open("yuu_state.json", "w", encoding="utf-8") as f:
    json.dump(state, f, indent=2, ensure_ascii=False)
