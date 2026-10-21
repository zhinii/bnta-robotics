"""Build a secret-free upload archive from the checked-out simulator source."""
from pathlib import Path
import sys
import tarfile
import io

root = Path(__file__).resolve().parents[2]
output = Path(sys.argv[1]).resolve()
files = [p for p in (root / 'six-axis-agent').iterdir() if p.suffix in ('.html', '.css', '.mjs') and p.name != 'serve.mjs']
files += list((root / 'beginner-3axis' / 'vendor' / 'three').rglob('*.js'))
files += [root / 'beginner-3axis/vendor/three/LICENSE', root / 'LICENSE']
files += [Path(__file__).parent / name for name in ('school_server.py', 'school-server.sh', 'SCHOOL-SERVER.md')]
with tarfile.open(output, 'w:gz') as archive:
    for file in sorted(files):
        name = 'robot-lab-school/' + file.relative_to(root).as_posix()
        data = file.read_bytes().replace(b'\r\n', b'\n')
        info = tarfile.TarInfo(name)
        info.size = len(data)
        info.mode = 0o755 if file.suffix == '.sh' else 0o644
        archive.addfile(info, io.BytesIO(data))
print(output)
