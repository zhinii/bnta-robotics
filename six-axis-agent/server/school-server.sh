#!/usr/bin/env bash
set -euo pipefail
robot_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
robot_script="$robot_root/six-axis-agent/server/school_server.py"
robot_state="${XDG_STATE_HOME:-$HOME/.local/state}/bnta-robot-lab"
robot_python="${ROBOT_PYTHON:-python3}"
umask 077
mkdir -p "$robot_state"
chmod 700 "$robot_state"

running() {
  [[ -f "$robot_state/server.pid" ]] || return 1
  read -r robot_pid < "$robot_state/server.pid"
  [[ "$robot_pid" =~ ^[0-9]+$ ]] || return 1
  kill -0 "$robot_pid" 2>/dev/null || return 1
  [[ -r "/proc/$robot_pid/cmdline" ]] || return 1
  tr '\0' '\n' < "/proc/$robot_pid/cmdline" | grep -Fxq -- "$robot_script"
}
case "${1:-status}" in
  start)
    if running; then printf 'Robot Lab is already running (PID %s).\n' "$robot_pid"; exit 0; fi
    "$robot_python" -c 'import sys; assert sys.version_info >= (3,9), "Python 3.9 or newer is required"'
    nohup "$robot_python" "$robot_script" serve > "$robot_state/server.log" 2>&1 < /dev/null &
    printf '%s\n' "$!" > "$robot_state/server.pid"
    sleep 1
    if running; then printf 'Robot Lab started (PID %s).\n' "$robot_pid"
    else cat "$robot_state/server.log"; exit 1; fi
    ;;
  stop)
    if running; then
      kill "$robot_pid"
      for robot_wait in {1..30}; do if ! running; then break; fi; sleep 0.1; done
      if running; then printf 'Still stopping; check again with status.\n'; exit 1; fi
      rm -f -- "$robot_state/server.pid"
      printf 'Robot Lab stopped.\n'
    else printf 'Robot Lab is not running.\n'; fi
    ;;
  restart) bash "$0" stop; bash "$0" start ;;
  status) if running; then printf 'Robot Lab is running (PID %s).\n' "$robot_pid"; else printf 'Robot Lab is not running.\n'; exit 1; fi ;;
  *) printf 'Usage: bash %s start|stop|restart|status\n' "$0"; exit 2 ;;
esac
