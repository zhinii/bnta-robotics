# Robot Lab — Six Axis

[Open the simulator](https://zhinii.github.io/bnta-robotics/six-axis-agent/)

For school hosting with a server-held Alibaba key entered through SSH, follow [School server deployment](server/SCHOOL-SERVER.md). The package needs only Python 3.9 or newer and runs separately on port 8082.

On phones and narrow tablets, the scene comes first, followed by the command input and the current exchange. Connection status appears once in the page header. Earlier messages, command ideas and the mobile inventory expand on demand. Replies do not automatically focus the phone keyboard or scroll the page to the input.

A conversational classroom activity set in an ordinary student dorm room: **This room is messy. Use your AI-controlled robot to organize the desk.** The robot is clamped to a short end of the desk, with its long edge against a plain wall. The laptop faces the chair and the low organizer follows the wall-side long edge. Five movable items are available: a red book, blue notebook, blue pen, yellow pencil and round pen cup. The fixed laptop and lamp are obstacles. The organizer has left, middle and right spaces; a movable open pen cup accepts the writing tools. The user chooses where things belong, including stacks and side-by-side arrangements. The room includes a bed, wardrobe, pinboard, drawer unit, chair and rug; the window has been removed. A compact corner card contains the Reset button. A bottom-left inventory replaces floating object labels. The original three-axis application is preserved.

“Drop the pen into the holder” turns it upright, carries it above a free opening, releases it and animates a short vertical fall. The planner checks the cup walls, floor and the entire drop volume. Both writing tools can be stored together and retrieved. Undo after a drop plans a real pickup and replacement, rather than reversing gravity. If no checked return path exists, undo is unavailable; restore remains a separately checked task. Stop during the brief fall lets the released item settle while stopping the arm. These are kinematic drops, without bouncing or friction simulation.

The pen holder is a hollow round cup with a circular floor, rim and graspable handle. Its body is 51 mm in diameter and 32.2 mm tall (25% narrower and 15% taller than the earlier cup). Move it empty or filled onto the middle shelf, then add or retrieve pens at its new location. It stays upright to retain its contents. Collision checks use conservative bounds around the curved walls and individual gripper parts, keeping the opening clear for both writing tools.

After placing an item on the shelf, the assistant asks whether that spot works or whether you would like it elsewhere. A conversational “yes” leaves it in place.

Enter your Alibaba API key in the chat's masked API-key field and press **Connect**. The key remains in tab memory, never enters the transcript or browser storage, and is forgotten on reload. Only language, model and API URL preferences are saved. This is the existing Qwen connection; a vision model is not required because the engine supplies exact scene data.

Every checked task first shows green destination outlines and a dashed gripper path. Choose **Run movement** to execute or **Cancel movement** to leave the scene and undo history unchanged. Rejected collisions show a red ghost of the actual rejected candidate pose and an outline of the blocking object. Amber marks unsupported placements or unreachable targets; it does not claim a collision. A rejected candidate is not proof that every possible route is blocked. Previews use copied state and can be dismissed or replaced by a new command.

“Put the pencil beside the pen” and “put the pen next to the pencil” can omit a side: the planner checks available sides without moving the anchor. Explicit sides and orientations are preserved. A bare “yes” after an either/or object question asks for the object name again. One transient connection failure is retried; rejected credentials are reported without retrying.

Try these requests:

- “This room is messy.” The robot asks which item to start with and where it belongs, rather than inventing the user's arrangement.
- “Stand the blue notebook on its short edge in the middle of the shelf.”
- “Put the red book on the left shelf, resting on its long edge.”
- “Lay it flat again”, “undo that”, or “put everything back where it started”.
- “Put the book in the middle of the organizer, then stack the notebook on it.”
- “Put the pen in the middle of the organizer and the pencil beside it on the left.”
- “Drop the pen and pencil into the holder.”
- “Hello!” A greeting includes a wave when the gripper is empty; thanks prompts a bow, and goodbye a wave.
- “Move in a circle, then move up and down.” The robot chooses small gestures without asking for coordinates.
- “Pick up the book and rotate it 90 degrees around X.” The controller checks alternative turning positions and keeps holding it. Y and Z are also supported.
- “Put it back at its start.” Placement preserves the held orientation. If the tilted placement cannot be reached, the whole task is rejected; it does not silently flatten the item.
- “Pick up the pen.” The assistant picks it up and asks where it should go.
- “Put it beside the book, on the left.” Placement uses the objects' dimensions.
- “Put everything back where it started.” The robot unpacks the stack and physically returns the objects, then homes.
- “Undo that.” Reverse the last fully completed task, including its grasp/release events and trajectory.
- “Do a lively dance, then bow.” Or “Wave hello twice.”
- “Move the gripper to 220, 30, 160 mm and rotate it to 5, -5, 20 degrees.”
- “Pick up that book.” If this could mean either book, the assistant asks which one.
- “Put the book in the pen holder.” It does not fit; the assistant explains and suggests the shelf.

The **microphone** transcribes in the selected English/Chinese language. Review the editable text, then press Send; recognition never executes a task automatically. The browser's speech service may process audio remotely and support varies; permission, missing-device and unavailable-service messages retain typing as a fallback. See [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

**Try a challenge** fills the composer without sending. **Reset** immediately restores the initial arrangement and clears conversation and undo history. **Stop** cancels AI requests, planning or animation and retains the actual pose and grip (a released falling item settles); it clears undo history, while “put everything back” remains available. Changing language during a task stops it.

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

Actions are schema-checked and the complete task is preflighted against a copy of the world in a cancellable Web Worker. Motion checks joint limits, swept joint interpolation, the tabletop, fixed furniture, object clearance, gripper and held-object bounds. Transfers try direct elevated paths, a waypoint through the home area, and arcs around the base. Invalid plans do not partially execute. A missing pickup may be repaired once by the model. Physical reach, collision and support failures stop the task and receive a controller-generated explanation; the model cannot replace them with a different task. No arbitrary model code runs.

Named-object placement uses a `transfer` action that picks up the specified object when needed, carries it, and releases it. Consecutive transfers can stack an object and pick it up again to return it without the model having to manage each gripper transition. A different already-held object is still a conflict that requires a destination. Failed-plan feedback includes the step index and simulated held object. Requests use Alibaba JSON Object output mode, a bounded 2,000-token response, and one schema/truncation repair attempt.

The controller supports grasp/release; placement on clear table coordinates, organizer spaces, beside objects (left/right from the seated user viewpoint in the dorm), on a suitable flat support, or at a remembered starting position; Cartesian tool poses; explicit six-joint poses; X/Y/Z rotation; home; restore; undo; wave; bow; circle; up/down; and gentle/lively dance. Rotation uses roll/pitch/yaw components, with robot-local frame +X front, +Y right and +Z up. Rotated bounds are used for clearance and placement height. Turning and placing are separate reachability problems. Orientation completion messages come from the actual simulated state, and restore resets orientation as well as position. There are at most 12 actions per request and three repetitions per named gesture. Preset gestures coexist with model-composed Cartesian sequences.

Undo stores up to eight completed tasks and reverses their validated trajectories; a drop needs a newly checked retrieval plan. The robot remembers its withdrawal route from a holder slot and checks it again before using it as a retrieval approach. These internal waypoints are excluded from the AI context. Restore handles stacked objects from the top down and can use an empty table region to resolve swapped starting positions. School objects use distinct sizes and grasp widths. A glue stick or ruler cannot be used as a stacking support.

The laptop collision model follows its keyboard base and tilted lid separately, preserving the usable air above the keyboard. The holder uses separate walls and a floor, with swept-volume checks for a released writing tool.

Natural placement orientations use `posture: "short-edge" | "long-edge" | "flat" | "upright"` on `place` or `transfer`. Short-edge/upright puts the longest dimension vertically; long-edge uses the middle dimension; flat uses the shortest dimension. The controller selects a feasible facing and grip without substituting a flat Z spin for standing. Object orientation and offset are tracked relative to the gripper. A different grip requires a visible release on the previous support and a new pickup, never an attachment change in midair. Shelf height, collision bounds, jaw width, inventory and completion text use the resulting pose. Upright books are not broad stacking supports. Undo preserves grasp transforms and restore returns original orientations.

Tests cover all four desk items standing on the middle shelf, both books resting on their long edges, the already-held notebook placed upright on the left shelf or back at its start, and undo/restore. Holder tests cover either insertion order, separately held tools, settled preview poses, retrieval and rejection of books or flat insertion. This does not guarantee every orientation at every location: a far shelf approach can still exceed the wrist range or hit the laptop. The simulation checks geometric support, not friction or balance.

This remains a simplified kinematic teaching simulator. Conservative bounding volumes and a limited family of transfer paths may reject a physically possible task; the planner is not complete. It does not model calibrated dynamics, forces, friction, detailed object deformation, all robot self-collisions, or certify physical hardware safety. The school props are illustrative scaled models. The simulated joint ranges stay unchanged; the tool solver permits low grasp centres for thin objects while the world controller checks the actual gripper/table clearance.

## Development and verification

From the repository root, run `node six-axis-agent/serve.mjs` and open `http://127.0.0.1:4226/six-axis-agent/`. This exact local origin is allowed by the relay. Open over HTTP, not by double-clicking the HTML file. No frontend build or external CDN is required. Three.js and OrbitControls come from the existing vendored directory. All runtime module imports and the entry CSS/module carry a shared release query to avoid stale mixed-version graphics after deployment; update the release string together when publishing changes.

Run:

~~~sh
node --test six-axis-agent/tests/*.test.mjs
node six-axis-agent/tests/browser.mjs
~~~

The browser test requires Playwright and Microsoft Edge, and starts its own local static server. Set BNTA_PLAYWRIGHT_PATH to an installed Playwright module URL, BNTA_SCREENSHOTS to capture desktop/mobile images, or BNTA_PREVIEW_URL to test a deployed frontend.

Checks cover all four desk objects in all three shelf spaces, both book/notebook stack orders, shelf edges and side-by-side height, fixed furniture, all three 90-degree rotations with restore/undo, retained placement orientation, atomic tilted-placement failure, every school object/table-region combination, six three-block tower orders, occupied origins, stopped pickups, seeded arrangements, gestures, model transport, relay bounds and speech handling. The optional browser suite covers WebGL, reversible tasks, requests, refusal, cancellation, mobile layout, Chinese persistence and secret exclusion with mocked provider and speech responses. Live Alibaba inference and a real microphone require the user's own connection and device.

Copyright (c) 2026 Christopher Hansen. [MIT license](../LICENSE). Three.js retains its existing license in the parent project.
