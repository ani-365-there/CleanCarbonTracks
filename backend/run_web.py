import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
WEB = ROOT / "apps" / "web"
os.chdir(WEB)
sys.path[:0] = [str(ROOT / "modules"), str(ROOT / "platform"), str(ROOT / "apps"), str(WEB)]

import uvicorn

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
