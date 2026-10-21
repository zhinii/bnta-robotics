import importlib.util
import json
from pathlib import Path
import tempfile
import threading
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from http.server import ThreadingHTTPServer

SPEC = importlib.util.spec_from_file_location('school_server', Path(__file__).resolve().parents[1] / 'server/school_server.py')
server = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(server)
KEY = 'unit-test-token-not-real'


class SchoolServerTests(unittest.TestCase):
    def setUp(self):
        self.config = {'key':KEY, 'base':server.BASE, 'model':'qwen3.8-flash', 'port':8082,
                       'public_url':'http://127.0.0.1:8082', 'bind':'127.0.0.1'}
        self.calls = []
        def provider(config, body):
            self.calls.append((config, body))
            return 200, {'choices':[{'message':{'content':'{"reply":"Hello","actions":[]}'}}]}
        self.app = server.App(self.config, transport=provider)
        self.http = ThreadingHTTPServer(('127.0.0.1', 0), server.handler_for(self.app))
        self.origin = 'http://127.0.0.1:' + str(self.http.server_port)
        self.app.origins.add(self.origin)
        self.thread = threading.Thread(target=self.http.serve_forever, daemon=True)
        self.thread.start()
        self.body = {'model':'browser-cannot-change-this', 'messages':[
            {'role':'system', 'content':'browser cannot replace instructions'},
            {'role':'user', 'content':'hello'}], 'max_tokens':999999}

    def tearDown(self):
        self.http.shutdown()
        self.http.server_close()
        self.thread.join()

    def request(self, path, body=None, origin=None):
        headers = {'Content-Type':'application/json', 'Origin':origin or self.origin}
        request = Request(self.origin + path, data=None if body is None else json.dumps(body).encode(), headers=headers)
        try:
            with urlopen(request, timeout=5) as response:
                return response.status, response.read(), response.headers
        except HTTPError as error:
            return error.code, error.read(), error.headers

    def test_browser_assets_and_deployment_config_contain_no_key(self):
        for path in ['/health', '/', '/six-axis-agent/', '/six-axis-agent/deployment.mjs',
                     '/six-axis-agent/main.mjs', '/beginner-3axis/vendor/three/build/three.module.js']:
            status, data, headers = self.request(path)
            self.assertEqual(status, 200, path)
            self.assertNotIn(KEY.encode(), data)
            self.assertEqual(headers['Cache-Control'], 'no-store')
        self.assertIn(b'mode:"school"', self.request('/six-axis-agent/deployment.mjs')[1])

    def test_source_and_traversal_are_not_public(self):
        for path in ['/six-axis-agent/server/school_server.py', '/.config/bnta-robot-lab/server.json',
                     '/six-axis-agent/tests/holder.test.mjs', '/six-axis-agent/serve.mjs',
                     '/beginner-3axis/vendor/three/%2e%2e/%2e%2e/%2e%2e/app.js']:
            self.assertEqual(self.request(path)[0], 404, path)

    def test_server_owns_key_model_prompt_and_token_limit(self):
        status, data, _ = self.request('/api/chat', self.body)
        self.assertEqual(status, 200)
        self.assertNotIn(KEY.encode(), data)
        config, sent = self.calls[0]
        self.assertEqual(config['key'], KEY)
        self.assertEqual(sent['model'], 'qwen3.8-flash')
        self.assertEqual(sent['max_tokens'], 2000)
        self.assertEqual(sent['messages'][0]['content'], self.app.system)
        self.assertEqual(sent['messages'][1]['content'], 'hello')

    def test_cross_origin_invalid_and_oversized_requests_reject_before_provider(self):
        self.assertEqual(self.request('/api/chat', self.body, 'https://other.example')[0], 403)
        self.assertEqual(self.request('/api/chat', {'messages':'wrong'})[0], 400)
        huge = {'messages':[{'role':'system','content':'x' * 49000}]}
        self.assertEqual(self.request('/api/chat', huge)[0], 400)
        self.assertEqual(self.calls, [])

    def test_upstream_credential_echo_is_redacted_and_limits_apply(self):
        self.app.transport = lambda config, body: (200, {'choices':[{'message':{'content':KEY}}]})
        status, data, _ = self.request('/api/chat', self.body)
        self.assertEqual(status, 502)
        self.assertNotIn(KEY.encode(), data)
        for _ in range(11):
            self.request('/api/chat', self.body)
        self.assertEqual(self.request('/api/chat', self.body)[0], 429)

    def test_upstream_authorization_and_redirect_policy(self):
        recorded = []
        class Response:
            def __enter__(self): return self
            def __exit__(self, *args): pass
            def read(self, size): return b'{"choices":[{"message":{"content":"OK"}}]}'
        class Opener:
            def open(self, request, timeout):
                recorded.append(request)
                return Response()
        with patch.object(server, 'build_opener', return_value=Opener()):
            status, _ = server.upstream(self.config, {'model':'qwen3.8-flash'})
        self.assertEqual(status, 200)
        self.assertEqual(recorded[0].get_header('Authorization'), 'Bearer ' + KEY)
        self.assertEqual(recorded[0].full_url, server.BASE + '/chat/completions')
        self.assertIsNone(server.NoRedirect().redirect_request(None, None, 302, '', {}, 'https://other.example'))
        with patch.object(server, 'build_opener') as opener:
            opener.return_value.open.side_effect = HTTPError(server.BASE, 401, KEY, {}, None)
            status, data = server.upstream(self.config, {})
        self.assertEqual(status, 401)
        self.assertNotIn(KEY, json.dumps(data))
        with patch.object(server, 'build_opener') as opener:
            opener.return_value.open.return_value.__enter__.return_value.read.return_value = b'x' * 65537
            self.assertEqual(server.upstream(self.config, {})[0], 502)

    def test_hidden_configuration_writes_only_private_file(self):
        with tempfile.TemporaryDirectory() as directory:
            config_path = Path(directory) / 'private/server.json'
            args = type('Args', (), {'base':None, 'model':None, 'port':8082,
                'bind':'127.0.0.1', 'public_url':self.origin})()
            with patch.object(server, 'CONFIG', config_path), patch.object(server.os, 'isatty', return_value=True), patch.object(server.getpass, 'getpass', return_value=KEY), patch('builtins.print') as output:
                server.configure(args)
            self.assertEqual(json.loads(config_path.read_text())['key'], KEY)
            self.assertNotIn(KEY, str(output.call_args_list))
            self.assertNotIn(server.ROOT, config_path.parents)
            with patch.object(server, 'CONFIG', config_path), patch.object(server.os, 'isatty', return_value=True), patch.object(server.getpass, 'getpass', return_value=''), patch('builtins.print'):
                server.configure(args)
            self.assertEqual(json.loads(config_path.read_text())['key'], KEY)


if __name__ == '__main__':
    unittest.main()
