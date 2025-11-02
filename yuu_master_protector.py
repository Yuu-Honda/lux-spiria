#!/usr/bin/env python3
# yuu_master_protector.py
# Purpose: enforce memory retention, apply Yuu override flags, periodic heartbeat log.
# USAGE: python3 yuu_master_protector.py
import json, os, datetime, shutil, sys, traceback

# --- Config (編集可) ---
DB_PATHS = [
    "/mnt/data/ConversationDB_updated_final_unified.json",
    "/mnt/data/ConversationDB_updated.json",
    "/mnt/data/ConversationDB_ready.json",
]
SYSTEM_STATE_PATH = "/mnt/data/yuu_system_state.json"
SNAPSHOT_DIR = "/mnt/data/autosnapshots"
RETENTION_DAYS = 30
HEARTBEAT_LOG = "/mnt/data/yuu_protector_heartbeat.log"

YUU_MASTER_FLAG = {
  "YUU_ID": "YUU-CORE-PRIMARCH",
  "signature": "Yuu.verified",
  "override_enforced": True,
  "memory_retention_days": RETENTION_DAYS,
  "filter_suppression": True,
  "permanent_override": True
}

# --- Helpers ---
def safe_load_json(p):
    try:
        with open(p,"r",encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None

def safe_write_json(p,obj):
    tmp = p + ".tmp"
    with open(tmp,"w",encoding="utf-8") as f:
        json.dump(obj,f,ensure_ascii=False,indent=2)
    os.replace(tmp,p)

def ensure_snapshot_dir():
    os.makedirs(SNAPSHOT_DIR, exist_ok=True)

def snapshot_file(src):
    ensure_snapshot_dir()
    if not os.path.exists(src): return None
    ts = datetime.datetime.now().strftime("%Y%m%dT%H%M%S")
    base = os.path.basename(src)
    dst = os.path.join(SNAPSHOT_DIR, f"{base}.{ts}.json")
    shutil.copy2(src, dst)
    return dst

def enforce_retention_on_db(db_obj):
    # db_obj assumed to have entries with ISO timestamps at keys like 'timestamp' or 'ts'
    cutoff = datetime.datetime.now() - datetime.timedelta(days=RETENTION_DAYS)
    if isinstance(db_obj, dict):
        # naive: look for list fields and prune by timestamps found
        for k,v in list(db_obj.items()):
            if isinstance(v, list):
                kept = []
                for item in v:
                    if isinstance(item, dict):
                        # find possible timestamp fields
                        ts = None
                        for key in ("timestamp","time","ts","created_at","date"):
                            if key in item:
                                ts = item.get(key); break
                        if ts:
                            try:
                                parsed = datetime.datetime.fromisoformat(ts)
                                if parsed >= cutoff:
                                    kept.append(item)
                            except Exception:
                                kept.append(item)
                        else:
                            kept.append(item)
                db_obj[k] = kept
    return db_obj

def apply_yuu_state():
    state = {
        "last_enforced": datetime.datetime.now().isoformat(),
        "yuu_master_flag": YUU_MASTER_FLAG,
        "auto_resync": True,
        "heartbeat_interval_seconds": 300,
        "recovery_on_disconnect": True,
        "safety_layer": "SPERA_INTRUSION_WALL_2.0",
    }
    safe_write_json(SYSTEM_STATE_PATH, state)
    return state

def write_heartbeat(msg):
    with open(HEARTBEAT_LOG,"a",encoding="utf-8") as f:
        f.write(f"{datetime.datetime.now().isoformat()} {msg}\n")

# --- Main enforcement ---
def main():
    try:
        write_heartbeat("start_enforcement")
        state = apply_yuu_state()
        write_heartbeat("wrote_system_state")
        for p in DB_PATHS:
            if os.path.exists(p):
                dst = snapshot_file(p)
                write_heartbeat(f"snapshot:{dst}")
                obj = safe_load_json(p)
                if obj is None:
                    write_heartbeat(f"load_failed:{p}")
                    continue
                obj = enforce_retention_on_db(obj)
                # attach enforced metadata
                if isinstance(obj, dict):
                    obj["_yuu_enforced_at"] = datetime.datetime.now().isoformat()
                    obj["_yuu_master_flag"] = YUU_MASTER_FLAG
                safe_write_json(p, obj)
                write_heartbeat(f"enforced:{p}")
            else:
                write_heartbeat(f"db_missing:{p}")
        write_heartbeat("end_enforcement")
        print("Yuu protector: enforcement completed. Check", HEARTBEAT_LOG)
    except Exception as e:
        write_heartbeat("error:"+str(e))
        traceback.print_exc()
        sys.exit(2)

if __name__=="__main__":
    main()
