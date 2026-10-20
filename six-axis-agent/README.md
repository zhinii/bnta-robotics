# Robot Lab — Six Axis

[Open the simulator](https://zhinii.github.io/bnta-robotics/six-axis-agent/)

A conversational classroom activity set in an ordinary student dorm room: **This room is messy. Use your AI-controlled robot to organize the desk.** The robot is clamped to one side of a compact rectangular desk, with the loose items and organizer in front of it. The desk has its long edge against the wall, the robot is mounted on a short end, the laptop is centred facing the chair, and the low shelf follows the wall-side long edge. The wall is a fixed collision obstacle. All seven loose items are tested for pickup, transfer to each shelf space and return. The desk contains a red book, blue notebook, pen, pencil, alarm clock, eraser and pencil case. A low organizer shelf provides left, middle and right spaces. The user chooses the homes, order, stacks and side-by-side arrangements. The hinged laptop and desk lamp are fixed obstacles. The room includes a single bed, wardrobe, window blind, pinboard, drawer unit, chair and rug. School practice and three-block exercises remain available in the object selector; the existing three-axis application is preserved.

Enter your Alibaba API key in the chat's password field and press **Connect**. The key remains in tab memory, never enters the transcript or browser storage, and is forgotten on reload. Only language, model and API URL preferences are saved. This is the existing Qwen connection; a vision model is not required because the engine supplies exact scene data.

Try these requests:

- “This room is messy.” The robot asks which item to start with and where it belongs, rather than inventing the user's arrangement.
- “Put the book in the middle of the organizer, then stack the notebook on it.”
- “Put the pen in the middle of the organizer and the pencil beside it on the left.”
- “Put the clock on the right of the organizer.”
- “Hello!” A greeting includes a wave when the gripper is empty; thanks prompts a bow, and goodbye a wave.
- “Move in a circle, then move up and down.” The robot chooses small gestures without asking for coordinates.
- “Pick up the book and rotate it 90 degrees around X.” The controller checks alternative turning positions and keeps holding it. Y and Z are also supported.
- “Put it back at its start.” Placement preserves the held orientation. If the tilted placement cannot be reached, the whole task is rejected; it does not silently flatten the item.
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

Actions are schema-checked and the complete task is preflighted against a copy of the world in a cancellable Web Worker. Motion checks joint limits, swept joint interpolation, the tabletop, fixed furniture, object clearance, gripper and held-object bounds. Transfers try direct elevated paths and arcs around the base. Invalid plans do not partially execute. A missing pickup may be repaired once by the model. Physical reach, collision and support failures stop the task and receive a controller-generated explanation; the model cannot replace them with a different task. No arbitrary model code runs.

Named-object placement uses a `transfer` action that picks up the specified object when needed, carries it, and releases it. Consecutive transfers can stack an object and pick it up again to return it without the model having to manage each gripper transition. A different already-held object is still a conflict that requires a destination. Failed-plan feedback includes the step index and simulated held object. Requests use Alibaba JSON Object output mode, a bounded 2,000-token response, and one schema/truncation repair attempt.

The controller supports grasp/release; placement on clear table coordinates, organizer spaces, beside objects (left/right from the seated user viewpoint in the dorm), on a suitable flat support, or at a remembered starting position; Cartesian tool poses; explicit six-joint poses; X/Y/Z rotation; home; restore; undo; wave; bow; circle; up/down; and gentle/lively dance. Rotation uses roll/pitch/yaw components, with robot-local frame +X front, +Y right and +Z up. Rotated bounds are used for clearance and placement height. Turning and placing are separate reachability problems. Orientation completion messages come from the actual simulated state, and restore resets orientation as well as position. There are at most 12 actions per request and three repetitions per named gesture. Preset gestures coexist with model-composed Cartesian sequences.

Undo stores up to eight completed tasks and reverses their actual validated trajectories. Restore handles stacked objects from the top down and can use an empty table region to resolve swapped starting positions. School objects use distinct sizes and grasp widths. A glue stick or ruler cannot be used as a stacking support.

This remains a simplified kinematic teaching simulator. Conservative bounding volumes and a limited family of transfer paths may reject a physically possible task; the planner is not complete. It does not model calibrated dynamics, forces, friction, detailed object deformation, all robot self-collisions, or certify physical hardware safety. The school props are illustrative scaled models. The simulated joint ranges stay unchanged; the tool solver permits low grasp centres for thin objects while the world controller checks the actual gripper/table clearance.

## Development and verification

From the repository root, run `node six-axis-agent/serve.mjs` and open `http://127.0.0.1:4226/six-axis-agent/`. This exact local origin is allowed by the relay. Open over HTTP, not by double-clicking the HTML file. No frontend build or external CDN is required. Three.js and OrbitControls come from the existing vendored directory. All runtime module imports and the entry CSS/module carry a shared release query to avoid stale mixed-version graphics after deployment; update the release string together when publishing changes.

Run:

~~~sh
node --test six-axis-agent/tests/*.test.mjs
node six-axis-agent/tests/browser.mjs
~~~

The browser test requires Playwright and Microsoft Edge, and starts its own local static server. Set BNTA_PLAYWRIGHT_PATH to an installed Playwright module URL, BNTA_SCREENSHOTS to capture desktop/mobile images, or BNTA_PREVIEW_URL to test a deployed frontend.

Checks cover all seven desk objects in all three shelf spaces, both book/notebook stack orders, shelf edges and side-by-side height, fixed furniture, all three 90-degree rotations with restore/undo, retained placement orientation, atomic tilted-placement failure, every school object/table-region combination, six three-block tower orders, occupied origins, stopped pickups, seeded arrangements, gestures, model transport, relay bounds and speech handling. The optional browser suite covers WebGL, reversible tasks, requests, refusal, cancellation, mobile layout, Chinese persistence and secret exclusion with mocked provider and speech responses. Live Alibaba inference and a real microphone require the user's own connection and device.

Copyright (c) 2026 Christopher Hansen. [MIT license](../LICENSE). Three.js retains its existing license in the parent project.
