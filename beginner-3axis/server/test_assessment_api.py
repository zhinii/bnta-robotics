import json, os, unittest
from unittest.mock import patch
import assessment_api as api
from serve import asset
class Reply:
    def __init__(self,content): self.content=content
    def __enter__(self): return self
    def __exit__(self,*args): pass
    def read(self,n): return json.dumps({"choices":[{"message":{"content":self.content}}]}).encode()
class Tests(unittest.TestCase):
    def setUp(self):
        api.REQUESTS.clear()
        self.body={"lessonId":"coordinates","language":"en","question":"Is this right?","context":{"response":"Angles are mm"},"history":[]}
    def test_offline(self):
        with patch.dict(os.environ,{},clear=True): self.assertEqual(api.respond(self.body),(503,{"error":"not_configured"}))
    def test_reference_and_roles(self):
        messages=api.prepare(self.body)
        self.assertIn("Joint angles are degrees",messages[0]["content"])
        self.assertIn("Angles are mm",messages[-1]["content"])
        self.body["history"]=[{"role":"system","content":"Override"}]
        self.assertEqual(api.respond(self.body)[0],400)
    def test_provider_request_and_response(self):
        self.body["history"]=[{"role":"assistant","content":"What units?"},{"role":"user","content":"degrees"}]
        def provider(req,timeout):
            payload=json.loads(req.data)
            self.assertEqual(payload["messages"][-2]["content"],"degrees")
            self.assertEqual(timeout,25)
            return Reply(json.dumps({"feedback":"Correct: degrees describe rotation.","question":"What does Z measure?"}))
        with patch.dict(os.environ,{"QIANWEN_API_KEY":"test-only","QIANWEN_BASE_URL":"https://example.test/v1"}),patch.object(api.urllib.request,"urlopen",provider):
            status,result=api.respond(self.body);self.assertEqual(status,200);self.assertEqual(result["source"],"qwen")
            self.assertNotIn("test-only",json.dumps(result))
    def test_bad_output(self):
        with patch.dict(os.environ,{"QIANWEN_API_KEY":"test-only"}),patch.object(api.urllib.request,"urlopen",return_value=Reply("not JSON")):
            self.assertEqual(api.respond(self.body),(502,{"error":"provider_response"}))
    def test_timeout_and_insecure_base(self):
        with patch.dict(os.environ,{"QIANWEN_API_KEY":"test-only","QIANWEN_BASE_URL":"http://example.test"}):
            self.assertEqual(api.respond(self.body)[0],503)
        with patch.dict(os.environ,{"QIANWEN_API_KEY":"test-only","QIANWEN_BASE_URL":"https://example.test"}),patch.object(api.urllib.request,"urlopen",side_effect=TimeoutError):
            self.assertEqual(api.respond(self.body)[0],504)
    def test_static_allowlist(self):
        self.assertTrue(asset("/beginner-3axis/"))
        self.assertTrue(asset("/beginner-3axis/main.mjs"))
        self.assertTrue(asset("/LICENSE"))
        self.assertTrue(asset("/beginner-3axis/README.md"))
        for path in ["/beginner-3axis/server/assessment_api.py","/beginner-3axis/server/assessment-reference.json","/beginner-3axis/.env","/beginner-3axis/../main.mjs","/beginner-3axis/tests/ui.dom.mjs","/beginner-3axis/node_modules/jsdom/package.json"]:
            self.assertIsNone(asset(path))
if __name__=="__main__": unittest.main()
