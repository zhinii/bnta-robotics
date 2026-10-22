#!/usr/bin/env python3
"""School-only Robot Lab host. Python 3.9+, standard library, no root required."""
import argparse
import getpass
import json
import os
from pathlib import Path
import re
import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit, unquote
from urllib.request import Request, build_opener, HTTPRedirectHandler

ROOT = Path(__file__).resolve().parents[2]
CONFIG = Path.home() / '.config' / 'bnta-robot-lab' / 'server.json'
BASE = 'https://token-plan.maas.qianwenaiapi.com/compatible-mode/v1'
ENDPOINTS = {BASE,
    'https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1',
    'https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1',
    'https://dashscope.aliyuncs.com/compatible-mode/v1',
    'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'}
TYPES = {'.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
         '.mjs':'text/javascript; charset=utf-8', '.js':'text/javascript; charset=utf-8',
         '.svg':'image/svg+xml', '.png':'image/png', '.ico':'image/x-icon'}


def validate(config):
    key = config.get('key', '')
    if not isinstance(key, str) or not re.fullmatch(r'[^\s]{1,512}', key):
        raise ValueError('A non-empty Alibaba key is required.')
    if config.get('base') not in ENDPOINTS:
        raise ValueError('Choose one of the supported Alibaba endpoints.')
    if not re.fullmatch(r'[\w.\-]{1,100}', config.get('model', '')):
        raise ValueError('Invalid model name.')
    if not re.fullmatch(r'[\w.\-]{1,100}', config.get('vision_model', 'qwen3.7-plus')):
        raise ValueError('Invalid image model name.')
    if not isinstance(config.get('port'), int) or not 1024 <= config['port'] <= 65535:
        raise ValueError('Use an unprivileged port between 1024 and 65535.')
    origin = urlsplit(config.get('public_url', ''))
    if origin.scheme not in ('http', 'https') or not origin.hostname or origin.username or origin.password or origin.path not in ('', '/') or origin.query or origin.fragment:
        raise ValueError('Public URL must be the site origin, such as http://192.168.230.31:8082.')
    config['public_url'] = config['public_url'].rstrip('/')
    if config.get('bind') not in ('127.0.0.1', '0.0.0.0'):
        raise ValueError('Bind must be 127.0.0.1 or 0.0.0.0.')
    return config


def load_config(path=None):
    path = CONFIG if path is None else path
    try:
        return validate(json.loads(path.read_text(encoding='utf-8')))
    except FileNotFoundError:
        raise ValueError('Run configure first to enter your Alibaba key.') from None


def configure(args):
    # getpass refuses to put the key in the terminal's visible input/history.
    if not os.isatty(0):
        raise ValueError('Run configure in an interactive SSH terminal.')
    previous = load_config() if CONFIG.exists() else {}
    key = getpass.getpass('Alibaba API key (hidden; Enter keeps existing key): ').strip()
    config = validate({
        'key': key or previous.get('key', ''),
        'base': args.base or previous.get('base', BASE),
        'model': args.model or previous.get('model', 'qwen3.8-flash'),
        'vision_model': getattr(args, 'vision_model', None) or previous.get('vision_model', 'qwen3.7-plus'),
        'port': args.port or previous.get('port', 8082),
        'bind': args.bind or previous.get('bind', '0.0.0.0'),
        'public_url': args.public_url or previous.get('public_url', 'http://127.0.0.1:8082'),
    })
    CONFIG.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    os.chmod(CONFIG.parent, 0o700)
    temporary = CONFIG.with_suffix('.tmp')
    fd = os.open(str(temporary), os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, 'w', encoding='utf-8') as stream:
        json.dump(config, stream)
    os.chmod(temporary, 0o600)
    os.replace(temporary, CONFIG)
    print('Configuration saved privately. Restart the service after changing it.')
    print('Student URL: ' + config['public_url'] + '/six-axis-agent/')


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def upstream(config, body):
    request = Request(config['base'] + '/chat/completions',
        data=json.dumps(body).encode(), method='POST',
        headers={'Content-Type':'application/json', 'Authorization':'Bearer ' + config['key']})
    try:
        with build_opener(NoRedirect()).open(request, timeout=25) as response:
            raw = response.read(65537)
        if len(raw) > 65536:
            return 502, {'error':'response_size'}
        data = json.loads(raw)
        choice = data['choices'][0]
        content = choice['message']['content']
        if not isinstance(content, str) or len(content) > 12000:
            return 502, {'error':'response'}
        return 200, {'choices':[{'message':{'content':content},
            'finish_reason':'length' if choice.get('finish_reason') == 'length' else 'stop'}]}
    except HTTPError as error:
        return error.code if error.code in (400, 401, 403, 404, 429) else 502, {'error':'provider'}
    except (URLError, socket.timeout, ValueError, KeyError, IndexError, TypeError, OSError):
        return 502, {'error':'connection'}


class App:
    def __init__(self, config, root=ROOT, transport=upstream):
        self.config, self.root, self.transport = config, root, transport
        source = (root / 'six-axis-agent' / 'agent.mjs').read_text(encoding='utf-8')
        self.system = source.split('export const SYSTEM = `', 1)[1].split('`;', 1)[0]
        self.slots = threading.BoundedSemaphore(3)
        self.lock, self.requests = threading.Lock(), []
        self.origins = {config['public_url'], 'http://127.0.0.1:' + str(config['port']),
                        'http://localhost:' + str(config['port'])}

    def chat(self, body, client):
        messages = body.get('messages') if isinstance(body, dict) else None
        if not isinstance(messages, list) or not 2 <= len(messages) <= 14:
            return 400, {'error':'request'}
        for index, item in enumerate(messages):
            if not isinstance(item, dict) or item.get('role') not in (('system',) if index == 0 else ('user', 'assistant')) or not isinstance(item.get('content'), str) or len(item['content']) > 20000:
                return 400, {'error':'request'}
        # The browser cannot replace the robot instructions, model or upstream.
        clean = [{'role':'system', 'content':self.system}] + [
            {'role':m['role'], 'content':m['content']} for m in messages[1:]]
        image = body.get('scene_image')
        if image and (not isinstance(image, dict) or any(type(image.get(k)) is not int or not 1 <= image[k] <= 512 for k in ('width', 'height')) or not isinstance(image.get('data'), str) or len(image['data']) > 64000 or not re.fullmatch(r'data:image/jpeg;base64,[A-Za-z0-9+/]+={0,2}', image['data'])):
            return 400, {'error':'image'}
        text = clean[-1]['content']
        if image:
            clean[-1]['content'] = [{'type':'text', 'text':text}, {'type':'image_url', 'image_url':{'url':image['data']}}]
        with self.lock:
            now = time.monotonic()
            self.requests[:] = [(stamp, ip) for stamp, ip in self.requests if now-stamp < 60]
            if len(self.requests) >= 60 or sum(ip == client for _, ip in self.requests) >= 12:
                return 429, {'error':'busy'}
            self.requests.append((now, client))
        if not self.slots.acquire(blocking=False):
            return 429, {'error':'busy'}
        try:
            payload = {'model':self.config.get('vision_model', 'qwen3.7-plus') if image else self.config['model'], 'messages':clean,
                'temperature':.6 if body.get('temperature') == .6 else .2, 'max_tokens':2000, 'response_format':{'type':'json_object'},
                'stream':False, 'enable_thinking':False}
            status, data = self.transport(self.config, payload)
            image_status = 'seen' if image else None
            if image and status in (400, 403, 404):
                clean[-1]['content'] = text
                payload['model'] = self.config['model']
                status, data = self.transport(self.config, payload)
                image_status = 'unavailable'
            # Do not return a credential even if an upstream diagnostic echoes it.
            if self.config['key'] in json.dumps(data):
                return 502, {'error':'response'}
            if status == 200 and image_status:
                data = {**data, 'perception':{'imageStatus':image_status}}
            return status, data
        finally:
            self.slots.release()


def handler_for(app):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, format, *args):
            pass  # No keys, prompt bodies, response bodies or URL queries in logs.

        def send_data(self, status, data, mime='application/json; charset=utf-8'):
            if not isinstance(data, bytes):
                data = json.dumps(data, ensure_ascii=False).encode()
            self.send_response(status)
            self.send_header('Content-Type', mime)
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Cache-Control', 'no-store')
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.end_headers()
            try:
                self.wfile.write(data)
            except (BrokenPipeError, ConnectionResetError):
                pass

        def do_GET(self):
            path = unquote(urlsplit(self.path).path)
            if path in ('/', '/six-axis-agent'):
                self.send_response(302)
                self.send_header('Location', '/six-axis-agent/')
                self.send_header('Content-Length', '0')
                self.end_headers()
                return
            if path == '/health':
                return self.send_data(200, {'status':'ok', 'configured':True, 'model':app.config['model']})
            if path == '/six-axis-agent/deployment.mjs':
                return self.send_data(200, b'export default {mode:"school"};', 'text/javascript; charset=utf-8')
            if path == '/six-axis-agent/':
                path = '/six-axis-agent/index.html'
            parts = path.lstrip('/').split('/')
            allowed = ((len(parts) == 2 and parts[0] == 'six-axis-agent' and parts[1] != 'serve.mjs')
                       or path.startswith('/beginner-3axis/vendor/three/'))
            file = (app.root / path.lstrip('/')).resolve()
            if not allowed or any(p.startswith('.') for p in parts) or app.root.resolve() not in file.parents or file.suffix not in TYPES or not file.is_file():
                return self.send_data(404, {'error':'not_found'})
            return self.send_data(200, file.read_bytes(), TYPES[file.suffix])

        def do_POST(self):
            if urlsplit(self.path).path != '/api/chat':
                return self.send_data(404, {'error':'not_found'})
            origin = self.headers.get('Origin', '')
            if origin not in app.origins or urlsplit(origin).netloc != self.headers.get('Host'):
                return self.send_data(403, {'error':'origin'})
            try:
                size = int(self.headers.get('Content-Length', '0'))
                if self.headers.get('Transfer-Encoding') or not 0 < size <= 112000 or self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
                    return self.send_data(400, {'error':'request'})
                self.connection.settimeout(30)
                body = json.loads(self.rfile.read(size))
            except (ValueError, OSError):
                return self.send_data(400, {'error':'request'})
            status, data = app.chat(body, self.client_address[0])
            return self.send_data(status, data)
    return Handler


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=('configure', 'serve', 'check'))
    parser.add_argument('--public-url')
    parser.add_argument('--port', type=int)
    parser.add_argument('--bind', choices=('127.0.0.1', '0.0.0.0'))
    parser.add_argument('--base', choices=sorted(ENDPOINTS))
    parser.add_argument('--model')
    parser.add_argument('--vision-model')
    args = parser.parse_args()
    try:
        if args.command == 'configure':
            configure(args)
            return
        config = load_config()
        if args.command == 'check':
            status, _ = upstream(config, {'model':config['model'], 'messages':[{'role':'user', 'content':'Reply OK.'}], 'max_tokens':16, 'stream':False, 'enable_thinking':False})
            if status != 200:
                raise ValueError('Alibaba connection failed (HTTP %d). Check endpoint, model, key and outbound HTTPS.' % status)
            print('Alibaba connection OK. Key was not displayed.')
            return
        server = ThreadingHTTPServer((config['bind'], config['port']), handler_for(App(config)))
        print('Robot Lab listening on %s:%d' % (config['bind'], config['port']), flush=True)
        server.serve_forever()
    except (ValueError, OSError) as error:
        # Only controlled configuration/network messages, never provider bodies.
        parser.exit(1, str(error) + '\n')


if __name__ == '__main__':
    main()
