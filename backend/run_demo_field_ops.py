import sys
from pathlib import Path

sys.path[:0] = [str(Path(__file__).resolve().parent / "modules")]

from field_ops.server import serve

if __name__ == "__main__":
    serve()
