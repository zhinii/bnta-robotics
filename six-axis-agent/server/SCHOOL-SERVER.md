# School server deployment

This package hosts the six-axis simulator and Alibaba connection together. Students press **Connect**; the server supplies the key. The key is never sent to the browser. The GitHub Pages version uses a key saved in its hosted relay; this school version uses only its own server configuration.

## Updating the existing school installation

From Windows PowerShell, upload the desk reference challenge archive and connect:

```powershell
scp "Robot-Lab-school-six-axis-desk-references-20261109.tar.gz" xyc@192.168.230.31:~/
ssh xyc@192.168.230.31
```

Run the upload from the folder containing the archive, or use its full path. Then, on the school server:

```bash
tar -xzf "$HOME/Robot-Lab-school-six-axis-desk-references-20261109.tar.gz" -C "$HOME" &&
  bash "$HOME/robot-lab-school/six-axis-agent/server/school-server.sh" restart
curl -fsS http://127.0.0.1:8081/health
```

Reload [the existing school page](http://192.168.230.31:8081/six-axis-agent/). The update keeps the saved API key and port; do not run `configure` again for an existing installation.

## Fresh installation

Requires Linux, Python 3.9 or newer, SSH access and outbound HTTPS to the selected Alibaba endpoint. No pip packages, Node.js or root access are required. The examples use `xyc@192.168.230.31` and port 8081. If your installation uses a different address or account, change the examples to match. For a separate installation, choose a free port.

## 1. Upload from Windows PowerShell

Use the absolute local path of the provided archive:

```powershell
scp "C:\Users\zhini\OneDrive\Documents\ChatGPT\collaborative workspace\robot-arm-lab\Robot-Lab-school-six-axis-desk-references-20261109.tar.gz" xyc@192.168.230.31:~/
ssh xyc@192.168.230.31
```

## 2. Run inside the SSH terminal

```bash
python3 --version
tar -xzf "$HOME/Robot-Lab-school-six-axis-desk-references-20261109.tar.gz" -C "$HOME"
cd "$HOME/robot-lab-school"
python3 six-axis-agent/server/school_server.py configure --public-url http://192.168.230.31:8081 --port 8081
```

Paste the Alibaba key at the hidden prompt and press Enter. No characters appearing is normal. The key is saved in `~/.config/bnta-robot-lab/server.json` with owner-only file access (600; parent directory 700). It is outside the web files and is not written into shell history. Do not paste the key as an argument to a shell command.

Defaults match the simulator: `qwen3.8-flash` at `https://token-plan.maas.qianwenaiapi.com/compatible-mode/v1`. To use a different supported Alibaba endpoint/model, supply `--base URL --model MODEL` to `configure`; your key must belong to that service. Configuration is parsed as JSON, never sourced as shell code.

Check Alibaba access and start the service:

```bash
python3 six-axis-agent/server/school_server.py check
bash six-axis-agent/server/school-server.sh start
curl -fsS http://127.0.0.1:8081/health
```

`check` makes one small real Alibaba request and reports success/failure without printing the key. `/health` only confirms that the local service and configuration are loaded; it does not check Alibaba. If Python is too old, the earlier portable runtime can be used when it still exists:

```bash
export ROBOT_PYTHON="$HOME/bnta-runtime/python/bin/python3.12"
"$ROBOT_PYTHON" --version
```

Use `"$ROBOT_PYTHON"` instead of `python3` for configure/check, and keep this variable set when running the control script.

## 3. Open the simulator

Open `http://192.168.230.31:8081/six-axis-agent/` from a school-network computer and press **Connect**. A successful Connect checks Alibaba. Students enter commands, not the key. If local health works but this URL does not, ask IT to allow inbound TCP 8081 from the school network; check from PowerShell with:

```powershell
Test-NetConnection 192.168.230.31 -Port 8081
```

For your own test without opening a firewall port, run this in a separate PowerShell window and leave it open:

```powershell
ssh -N -L 8081:127.0.0.1:8081 xyc@192.168.230.31
```

Then open `http://localhost:8081/six-axis-agent/`. This tunnel only serves your own computer.

## Controls and key changes

Inside SSH, from `~/robot-lab-school`:

```bash
bash six-axis-agent/server/school-server.sh status
bash six-axis-agent/server/school-server.sh stop
bash six-axis-agent/server/school-server.sh start
```

To change the key later, enter it at the hidden prompt, then restart:

```bash
python3 six-axis-agent/server/school_server.py configure
bash six-axis-agent/server/school-server.sh restart
```

Pressing Enter at the key prompt keeps an existing key. The detached process normally continues after SSH closes; this launcher does not configure automatic restart after a server reboot. Logs are at `~/.local/state/bnta-robot-lab/server.log` (or `$XDG_STATE_HOME/bnta-robot-lab/server.log`) and omit request bodies, keys and conversations.

## School access and HTTPS

This is a lightweight internal classroom host, not an Internet-facing authenticated service. Everyone who can reach it can use the shared school's API quota. Restrict the port to the school network. It allows three simultaneous AI calls, 12 calls/minute/client IP and 60/minute overall. A reverse proxy may make all clients appear as one IP; the service deliberately does not trust forwarded IP headers.

For routine student use, ask IT to provide HTTPS and school access control through its existing reverse proxy. Bind the app to localhost with `configure --bind 127.0.0.1 --public-url https://YOUR-SCHOOL-HOST` if the proxy is on this same server, preserve the original `Host` header, proxy `/` to `http://127.0.0.1:8081`, and allow at least 35 seconds for AI calls. Restart after changing configuration. No browser CORS relay is needed: browser and API are on the same origin.

Use HTTPS for browser microphone access; localhost is also suitable for browser testing. Plain HTTP on the school IP supports typed commands but is not a dependable microphone deployment. The browser's speech service and Alibaba inference still require their respective network access.

## Verification boundaries

The deployment code is tested locally with an HTTP provider stub: static assets, same-origin requests, server-held key transport, rejected redirects, body/response limits and error redaction. A real school-server deployment and real Alibaba connection require the server and key; neither is claimed by a successful local test. The six-axis robot's motion, holder and restoration tests remain separate from hosting tests.
