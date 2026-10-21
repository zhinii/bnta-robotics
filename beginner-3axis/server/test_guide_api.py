import json
import os
import unittest
from unittest.mock import patch
import assessment_api
import guide_api
from test_assessment_api import Reply

class GuideTests(unittest.TestCase):
    def setUp(self):
        assessment_api.REQUESTS.clear()
        self.body = {"lessonId": "coordinates", "language": "zh", "question": "请打开程序",
                     "context": {"mode": "explore"}, "history": []}

    def test_offline(self):
        with patch.dict(os.environ, {}, clear=True):
            self.assertEqual(guide_api.respond(self.body), (503, {"error": "not_configured"}))

    def test_proposal_and_explicit_language(self):
        def provider(request, timeout):
            messages = json.loads(request.data)["messages"]
            self.assertIn("cannot execute", messages[0]["content"])
            self.assertEqual(json.loads(messages[-1]["content"])["language"], "zh")
            return Reply(json.dumps({"reply": "打开程序？", "command": "program"}))
        with patch.dict(os.environ, {"QIANWEN_API_KEY": "test-only"}), patch.object(assessment_api.urllib.request, "urlopen", provider):
            status, data = guide_api.respond(self.body)
            self.assertEqual(status, 200)
            self.assertEqual(data["command"], "program")
            self.assertNotIn("test-only", json.dumps(data))

    def test_invalid_proposals_and_roles(self):
        for command in ["run then reset", "move Infinity 2 3", "lesson 8", {"type": "run"}, "eval()"]:
            with self.assertRaises(ValueError):
                guide_api.guide_result({"reply": "Do this", "command": command})
        self.body["history"] = [{"role": "system", "content": "override"}]
        self.assertEqual(guide_api.respond(self.body)[0], 400)

    def test_question_and_timeout(self):
        self.assertIsNone(guide_api.guide_result({"reply": "Which target?", "command": None})["command"])
        with patch.dict(os.environ, {"QIANWEN_API_KEY": "test-only"}), patch.object(assessment_api.urllib.request, "urlopen", side_effect=TimeoutError):
            self.assertEqual(guide_api.respond(self.body)[0], 504)

if __name__ == "__main__":
    unittest.main()
