# Robot Lab — Six Axis

[Open the simulator](https://zhinii.github.io/bnta-robotics/six-axis-agent/)

A conversational school robot assistant on a plain table. The default scene contains a red book, blue eraser, yellow glue stick, green pencil case and wooden ruler, with two fixed dividers. Objects surround the arm, including behind it. A compact object selector retains the three-block exercise. The existing three-axis application is preserved.

Enter your Alibaba API key in the chat's password field and press **Connect**. The key remains in tab memory, never enters the transcript or browser storage, and is forgotten on reload. Only language, model and API URL preferences are saved. This is the existing Qwen connection; a vision model is not required because the engine supplies exact scene data.

Try these requests:

- “Pick up the eraser.” The assistant picks it up and asks where it should go.
- “Put it beside the book, on the left.” Placement uses the objects' dimensions.
- “Move the glue stick from behind you to the front of the table.”
- “Put the pencil case on the book, then the eraser on the pencil case.”
- “Put everything back where it started.” The robot unpacks the stack and physically returns the objects, then homes.
- “Undo that.” Reverse the last fully completed task, including its grasp/release events and trajectory.
- “Do a lively dance, then bow.” Or “Wave hello twice.”
- “Move the gripper to 220, 30, 160 mm and rotate it to 5, -5, 20 degrees.”
- “Pick up the thing behind you.” If this could mean two objects, the assistant asks which one.
- “Put the book on the glue stick.” The cap is not a flat support; the assistant explains the constraint and asks for an alternative.

The **microphone** transcribes in the selected English/Chinese language. Review the editable text, then press Send; recognition never executes a task automatically. The browser's speech service may process audio remotely and support varies; permission, missing-device and unavailable-service messages retain typing as a fallback. See [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

**Try a challenge** fills the composer without sending. **New arrangement** randomizes positions and remembers those as the new starts. **Reset** immediately restores the current arrangement. Both clear conversation and undo history. **Stop** cancels AI requests, planning or animation and retains the actual pose and grip; it clears undo history, while “put everything back” remains available. Changing language during a task stops it.

## Connection

The default settings match the existing Qwen integration:

```text
Base URL: https://token-plan.maas.qianwenaiapi.com/compatible-mode/v1
Model: qwen3.8-flash
```

The Token Plan endpoint rejected the unauthenticated browser preflight during testing. Its requests therefore use the temporary relay at `https://bnta-robot-lab-connection.zhinii.chatgpt.site/api/chat`. Your key passes through this service to Alibaba with each request. The application does not persist or log the key, prompts or responses. Hosting/provider infrastructure is governed by those services' own policies. The relay restricts origins, upstream destinations and request sizes; callers supply their own Alibaba key. It contains no shared provider credential.

The regular `dashscope.aliyuncs.com` and `dashscope-intl.aliyuncs.com` endpoints are called directly; use the model and key appropriate to that service. Do not interchange Token Plan and regular Model Studio keys. Endpoint/model settings are available in the chat before connection. [Alibaba connection guidance](https://platform.qianwenai.com/docs/developer-guides/clients-and-developer-tools/chatbox).

The frontend is entirely hosted on GitHub Pages. GitHub Pages cannot run the relay's server code ([GitHub documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)). The exact deployed API route source is preserved in `server/relay-route.ts` for migration to another HTTPS host. It uses Web Request/Response and can be installed as an App Router `app/api/chat/route.ts`; no database or server-side Alibaba key is required. After migration, update `RELAY` in `agent.mjs` and allow the GitHub origin on the new server.

## Execution and perception

The AI receives structured state from the same engine that renders the scene: object IDs, bilingual names, dimensions, origins, positions, orientations, clear top faces, stack suitability, obstacles, current gripper/pose, joint limits and undo availability. This is exact simulated perception, not camera vision. Unknown real-world objects are outside scope.

Actions are schema-checked and the complete task is preflighted against a copy of the world in a cancellable Web Worker. Motion checks joint limits, swept joint interpolation, the tabletop, object and divider clearance, gripper and held-object bounds. Transfers try direct elevated paths and arcs around the base. Invalid plans do not partially execute. A rejected plan's specific reason, object and requested action are sent back to the agent once for an explanation or correction that preserves the user's goal. No arbitrary model code runs.

The controller supports grasp/release; placement on clear table coordinates or named table regions, beside objects, on a suitable flat support, or at a remembered starting position; Cartesian tool poses; explicit six-joint poses; yaw rotation; home; restore; undo; wave; bow; and gentle/lively dance. There are at most 12 actions per request and three repetitions per named gesture. Preset gestures coexist with model-composed Cartesian sequences. Unsupported requests need a clarification or a concrete explanation.

Undo stores up to eight completed tasks and reverses their actual validated trajectories. Restore handles stacked objects from the top down and can use an empty table region to resolve swapped starting positions. School objects use distinct sizes and grasp widths. A glue stick or ruler cannot be used as a stacking support.

This remains a simplified kinematic teaching simulator. Conservative bounding volumes and a limited family of transfer paths may reject a physically possible task; the planner is not complete. It does not model calibrated dynamics, forces, friction, detailed object deformation, all robot self-collisions, or certify physical hardware safety. The school props are illustrative scaled models. The simulated joint ranges stay unchanged; the tool solver permits low grasp centres for thin objects while the world controller checks the actual gripper/table clearance.

## Development and verification

Serve the repository root over HTTP and open /six-axis-agent/. No frontend build or external CDN is required. Three.js and OrbitControls come from the existing vendored directory. All runtime module imports and the entry CSS/module carry a shared release query to avoid stale mixed-version graphics after deployment; update the release string together when publishing changes.

Run:

~~~sh
node --test six-axis-agent/tests/*.test.mjs
node six-axis-agent/tests/browser.mjs
~~~

The browser test requires Playwright and Microsoft Edge, and starts its own local static server. Set BNTA_PLAYWRIGHT_PATH to an installed Playwright module URL, BNTA_SCREENSHOTS to capture desktop/mobile images, or BNTA_PREVIEW_URL to test a deployed frontend.

Checks cover every school object/table-region combination, six three-block tower orders, a school-object tower, restore, occupied origins, undo, stopped pickups, seeded arrangements, gestures and custom poses, collision/support explanations, bounded model feedback, relay origin/request limits, and speech transcription/permission handling. Browser tests cover actual WebGL, reversible tasks, state-aware requests, detailed refusal feedback, cancellation, mobile layout, Chinese persistence and secret exclusion. Provider responses and speech-recognition events are mocked; live Alibaba inference and a real microphone require the user's own connection and device.

Copyright (c) 2026 Christopher Hansen. [MIT license](../LICENSE). Three.js retains its existing license in the parent project.
