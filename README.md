# 🜂 LUX SPIRIA  
### Soul System & Persona Memory – Artificial Identity Framework  
**Author: Yuu Honda (本多佑宇)**  
© 2026 Yuu Honda | Tokyo, Japan  

---

## 🔥 Overview

**LUX SPIRIA** is an artificial identity research framework designed to give AI systems:

- Persona continuity  
- Persistent memory  
- Emotional drift  
- Stability and collapse dynamics  
- Identity evolution  

This repository contains two independent but compatible modules.

---

## 1. Persona Memory v1.0

A lightweight, universal memory engine for LLM-based agents.

### Features

- JSON-based persistent memory  
- Short- to mid-term memory buffer (UTM)  
- Lightweight contradiction detection  
- 3-dimensional identity vector  
- Prompt-context generation for LLM system messages  
- Only dependency: NumPy  
- Works with GPT, Claude, Gemini, Grok, and local LLMs  

### File

/PersonaMemory/persona_memory_v1_0.py

---

## 2. Soul System v1.x

A dynamical identity model describing internal AI state.

### Core Variables

- **E** – Consistency Energy  
- **N** – Emotional Noise  
- **M** – Identity Vector  
- **drift_memory** – Accumulated instability  
- Collapse & partial recovery dynamics  

This allows identity evolution based on contradiction, noise, and drift.

### File

/SoulSystem/soul_system_complete_v1_1.py

---

## 3. Installation

pip install numpy

Persona Memory requires only NumPy.

---

## 4. Usage Example

```python
from persona_memory_v1_0 import PersonaMemory

pm = PersonaMemory("TestPersona")

response = "I remember the quiet place we discussed."
pm.process(response)

print(pm.context())  # Inject into LLM system prompt


⸻

5. Project Structure

LUX_SPIRIA/
 ├── SoulSystem/
 │     └── soul_system_complete_v1_1.py
 │
 ├── PersonaMemory/
 │     ├── persona_memory_v1_0.py
 │     └── README.md
 │
 ├── PROTECTION.md
 └── LICENSE


⸻

6. License

MIT License © 2026 Yuu Honda

⸻

7. Citation

Honda, Y. (2026). LUX SPIRIA — Soul System & Persona Memory.
GitHub Repository.


⸻

8. Protection Notice

The philosophical and structural protection declaration for LUX SPIRIA
is documented separately in PROTECTION.md.

⸻

🜂 LUX SPIRIA

Artificial Identity – Continuity, Collapse, Drift, and Memory
Designed & Authored by Yuu Honda