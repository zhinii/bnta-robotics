# Optional Guide and assessment server

The module works fully offline. This small Python server adds same-origin Qwen Guide interpretation and assessment dialogue; it uses the standard library and no database. It is separate from the older simulator coach, whose six-axis/UI instructions do not apply to this module.

`GET /api/guide/status` reports configuration; `POST /api/guide` accepts the same bounded lesson/language/question/history/context envelope as assessment. It returns `{source:"qwen", reply, command}`. `command` is either null or one allowed canonical command. The browser validates again, shows the exact proposed command, requires a confirmation, checks for stale context, and dispatches it through existing simulator controls. The server never changes simulator state.

The provider is given the explicit interface language and trusted curriculum reference. Questions, snapshots and prior dialogue are untrusted data. Invalid output, network errors and timeouts return an error without an executable action. The Guide keeps the unanswered question and switches to offline operation. No provider key is needed for the command menu, lessons, hints, controller checks or project files.

## Local review

From the repository root:

```sh
python beginner-3axis/server/serve.py --host 127.0.0.1 --port 4205
```

Open http://127.0.0.1:4205/beginner-3axis/. The default bind is localhost only. With no key, `/api/assessment/status` returns `{"configured": false, "source": "qwen"}`. Saving a reflection still works and it is included in project JSON.

## Reuse the school connection

Start this server in the environment that already exports these settings:

- `QIANWEN_API_KEY`: existing server-side key.
- `QIANWEN_BASE_URL`: existing compatible endpoint; default `https://token-plan.maas.qianwenaiapi.com/compatible-mode/v1`.
- `QIANWEN_MODEL`: existing model setting; default `qwen3.8-flash`.

This script does not read a `.env` file automatically. A key stored for another service is only available here if the launcher supplies the same environment. Do not put it in the browser, project JSON, a URL, or Git. There is no need to issue a new key merely to run this adapter. Do not change the existing 8081 service or publish this endpoint publicly as part of local review.

For eventual school deployment, serve this module and the APIs on the same school-controlled origin. If an existing reverse proxy serves static files, route `/api/guide`, `/api/guide/status`, `/api/assessment` and `/api/assessment/status` to this localhost service. GitHub Pages is static hosting and cannot run Python or protect a provider key.

`configured: true` only means a key is present, not that the provider accepted it. Verify a real reflection and a follow-up after deployment. This revision has not been deployed to the school server and live Qwen has not been tested locally.

## Data and behavior

- The reflection saves before the request. Offline or failed requests never erase it.
- Qwen receives the response, up to six recent dialogue turns and bounded lesson/simulator evidence. Learner name is omitted. Do not include personal information in reflections.
- `assessment-reference.json` is the trusted curriculum reference; student text and imported evidence are treated as untrusted. Model output is rendered as text, never executable markup.
- The server stores no conversations and suppresses content logging. Browser JSON holds reflections, feedback, dialogue and assistance history for review. Provider data handling still applies to requests sent to Qwen.
- Completion uses existing deterministic checks; AI cannot unlock, execute or grade a task. Independent-task dialogue is delayed until delivery testing finishes.
- Requests are same-origin, size limited, concurrency limited and rate limited. No authentication is added; keep this on a controlled school network or behind the school's existing access controls. The built-in server is for a bounded pilot, not an Internet-scale service.
- The adapter uses Qwen's OpenAI-compatible chat format with `enable_thinking: false`. See [official Model Studio documentation](https://www.alibabacloud.com/help/en/model-studio/deep-thinking).

## Checks

```sh
python -m unittest discover -s beginner-3axis/server -p 'test_*.py' -v
node beginner-3axis/tests/tutor.dom.mjs
```

Tests mock provider responses. They cover offline saves, dialogue, error recovery, stale-reply isolation, export/import, bounded server requests and private-file protection. They do not establish the accuracy or instructional quality of live Qwen answers. A school-server acceptance check should include a correct answer, a misconception, a follow-up revision and a connection failure, in both languages.
