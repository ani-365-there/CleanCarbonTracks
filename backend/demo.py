import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path[:0] = [str(ROOT / "modules"), str(ROOT / "platform"), str(ROOT / "apps")]

from waste_network.demo import main

if __name__ == "__main__":
    main()
