# Robot Lab — Six Axis

[Open the simulator](https://zhinii.github.io/bnta-robotics/six-axis-agent/)

A focused conversational version of BNTA Robot Lab: a six-axis arm, three coloured blocks, two placement pads, and a chat. The existing three-axis app is preserved.

Enter your Alibaba API key in the password field inside the chat and press **Connect**. The app checks the connection before enabling commands. The key remains in page memory, is not added to the transcript or browser storage, and is forgotten on reload. Only language, model name and API base URL are saved. Chat and scene state reset on reload.

Examples:

- “Pick up the red block.” The arm picks it up, then asks where to place it.
- “Put it on the left pad.” The current held object is used.
- “Put it on top of the red block.” The held block is aligned and stacked on red if its top face is clear.
- “Do a dance for me.” An empty arm performs a short sway, wrist turn and bow, then returns home.
- “Pick up blue and put it on the right pad.” The whole plan is checked before moving.
- “Rotate it 90 degrees clockwise.” The agent can ask which view/direction you mean.
- “Pick up the block.” The agent asks which colour.
- “Fly to the moon.” The agent explains that it cannot do that.

**Stop** cancels pending AI requests or motion and keeps the actual current pose and grip. **Reset** restores the scene and clears the agent's conversation context. English/中文 explicitly controls new replies and remains selected after reload. Changing language during an operation stops it.

## Connection

The default settings match the existing Qwen integration:

```text
Base URL: https://token-plan.maas.qianwenaiapi.com/compatible-mode/v1
Model: qwen3.8-flash
```

The Token Plan endpoint rejected the unauthenticated browser preflight during testing. Its requests therefore use the temporary relay at `https://bnta-robot-lab-connection.zhinii.chatgpt.site/api/chat`. Your key passes through this service to Alibaba with each request. The application does not persist or log the key, prompts or responses. Hosting/provider infrastructure is governed by those services' own policies. The relay restricts origins, upstream destinations and request sizes; callers supply their own Alibaba key. It contains no shared provider credential.

The regular `dashscope.aliyuncs.com` and `dashscope-intl.aliyuncs.com` endpoints are called directly; use the model and key appropriate to that service. Do not interchange Token Plan and regular Model Studio keys. Endpoint/model settings are available in the chat before connection. [Alibaba connection guidance](https://platform.qianwenai.com/docs/developer-guides/clients-and-developer-tools/chatbox).

The frontend is entirely hosted on GitHub Pages. GitHub Pages cannot run the relay's server code ([GitHub documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)). The exact deployed API route source is preserved in `server/relay-route.ts` for migration to another HTTPS host. It uses Web Request/Response and can be installed as an App Router `app/api/chat/route.ts`; no database or server-side Alibaba key is required. After migration, update `RELAY` in `agent.mjs` and allow the GitHub origin on the new server.

## Model and execution

`kinematics.mjs` reuses Robot Lab's six-revolute-joint forward/inverse kinematics, joint limits and orientation solver. `scene.mjs` renders those actual joint transforms, including wrist joints and tool orientation. Every AI action is schema-checked, preflighted against a copy of the current world, then animated by the deterministic controller. Current scene snapshots and execution results accompany subsequent agent turns. Arbitrary model code never runs.

The task surface uses 36 mm blocks. Motion uses elevated transfer paths, joint interpolation checks, conservative block/link clearance and occupied-pad checks. The entire requested plan is rejected if any step fails. The UI reports pickup/placement only after the corresponding simulation event. This is a simplified kinematic teaching simulator: no calibrated dynamics, payload, force, friction, full self-collision or hardware safety assessment. Object placement is restricted to empty pads or aligned stacking on uncovered blocks. A block with another block on top cannot be moved until the top block is removed. Free-space release is unsupported. The dance is a fixed, preflighted motion and requires an empty gripper. Invalid AI action schemas receive one bounded correction attempt before the app explains its supported movements.

## Development and verification

Serve the repository root over HTTP and open `/six-axis-agent/`. No frontend build or external CDN is required; Three.js and OrbitControls come from the existing vendored directory.

```sh
node --test six-axis-agent/tests/world.test.mjs
# Requires Playwright and Microsoft Edge. The test starts its own static server.
node six-axis-agent/tests/browser.mjs
```

Set `BNTA_PLAYWRIGHT_PATH` to a Playwright module URL if it is not locally installed. Set `BNTA_SCREENSHOTS` to an output directory to capture desktop/mobile views. `BNTA_PREVIEW_URL` can target a deployed frontend.

Verified: every ordered block-stacking pair, unstacking, covered-block and self-stacking refusal, dance motion, bounded AI schema repair, all block/pad combinations, wrist rotation, occupied-pad refusal, atomic plan rejection, stopping and subsequent placement, schema enforcement, actual WebGL rendering, state-aware follow-up, clarification/refusal handling, invalid provider output, cancellation of stale replies, reset, persistent explicit language, and a 390 px mobile layout. Browser action tests use clearly marked mocked provider replies; no live successful Qwen inference was tested without the user's key.

Copyright (c) 2026 Christopher Hansen. [MIT license](../LICENSE). Three.js retains its existing license in the parent project.
