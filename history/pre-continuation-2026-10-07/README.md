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