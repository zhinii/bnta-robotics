# BNTA Robot Lab — Six Axis

[Open the simulator](https://zhinii.github.io/bnta-robotics/six-axis-agent/)

For school hosting with a server-held Alibaba key entered through SSH, follow [School server deployment](server/SCHOOL-SERVER.md). The package needs only Python 3.9 or newer and runs separately on port 8082.

On phones and narrow tablets, the scene comes first, followed by the command input and the current exchange. Connection status appears once in the page header. Earlier messages and command ideas expand on demand. The compact inventory stays open on every screen size, with equal 8 px side padding. Replies do not automatically focus the phone keyboard or scroll the page to the input.

A conversational classroom activity set in an ordinary student dorm room: **This room is messy. Use your AI-controlled robot to organize the desk.** The robot is clamped to a short end of the desk, with its long edge against a plain wall. The laptop faces the chair and the low organizer follows the wall-side long edge. Five movable items are available: a red book, blue notebook, blue pen, yellow pencil and square pen holder. The fixed laptop and lamp are obstacles. The organizer has left, middle and right spaces; a movable open pen cup accepts the writing tools. The user chooses where things belong, including stacks and side-by-side arrangements. The room includes a bed, wardrobe, pinboard, drawer unit, chair and rug; the window has been removed. A compact corner card contains the Reset button. A bottom-left inventory replaces floating object labels. The original three-axis application is preserved.

“Drop the pen into the holder” turns it upright, carries it above a free opening, releases it and animates a short vertical fall. The planner checks the cup walls, floor and the entire drop volume. Both writing tools can be stored together and retrieved. Undo after a drop plans a real pickup and replacement, rather than reversing gravity. If no checked return path exists, undo is unavailable; restore remains a separately checked task. Stop during the brief fall lets the released item settle while stopping the arm. These are kinematic drops, without bouncing or friction simulation.

The pen holder is an open square box with four 3 mm walls and a 4 mm floor. Its 35 mm inner width is 2.5 times the 14 mm pencil diameter; its 44 mm body height is half the 88 mm pencil length. The two writing tools settle upright in diagonally opposite corners. Drawing and collision checks share the same physical parts. The jaws travel closed, open only at a checked pre-grasp pose with 1 mm per side, and close to the actual projected grasp width. Opening and closing are animated and checked across the full jaw travel. The holder stays upright while carried. Minimum grasp height is derived from the shared finger/carrier geometry, so a thin pen clears its supporting surface and a taller object clears the carrier bodies.


After placing an item on the shelf, the assistant asks whether that spot works or whether you would like it elsewhere. A conversational “yes” leaves it in place.

Press **Connect** to use the shared Alibaba connection. The GitHub frontend sends commands to the existing ChatGPT Site relay. Its `ALIBABA_API_KEY` is held in Sites secret storage, is never sent to the browser, and does not enter this repository. The relay fixes the provider, model and robot instructions and bounds body size, response tokens and time. Per-worker limits allow three simultaneous calls, 12 requests per client per minute and 60 overall per minute; these are not a distributed billing cap. The Alibaba account quota remains the spending boundary. The separate school package uses its own same-origin Python backend and server-held key.


Every checked task first shows green destination outlines and a dashed gripper path. Choose **Run movement** to execute or **Cancel movement** to leave the scene and undo history unchanged. Rejected collisions show a red ghost of the actual rejected candidate pose and an outline of the blocking object. Amber marks unsupported placements or unreachable targets; it does not claim a collision. A rejected candidate is not proof that every possible route is blocked. Previews use copied state and can be dismissed or replaced by a new command.

“Put the pencil beside the pen” and “put the pen next to the pencil” can omit a side: the planner checks available sides without moving the anchor. Explicit sides and orientations are preserved. A bare “yes” after an either/or object question asks for the object name again. One transient connection failure is retried; rejected credentials are reported without retrying.

An unspecified “on the shelf” searches clear supported gaps across the shelf, instead of repeatedly selecting the middle. Relative placements reserve space for the object and the actual gripper. Clear endpoint checks, cached pickups and short routes precede longer detours; a held item tries its current grip before being set down to regrasp. Planning has bounded candidate and request time. An exhausted search means no checked route was found, not proof that no route exists. “How do you plan?” answers without resuming a failed task. Language guidance accommodates younger children, typos and ordinary item names, with one short clarification when needed.

Shelf searches cover both the width and depth, including candidates at surface edges and beside occupied footprints. The inventory and AI share explicit support/location facts from the current geometry, including stacked items and holder contents. “How much space is in front of the red book?” reports measured edge-to-edge shelf clearance, with front defined toward the laptop/chair. Measurements update after every movement and override stale conversation. Surface space alone does not establish that a particular grasp or route is possible. A planning time limit no longer displays an unrelated last rejected placement as evidence that the surface is unusable.

“Pick up the book from the top/front/back/left/right” sets a pickup approach independently of its final orientation. Directions refer to the student at the chair. Auto mode can try other grips; an explicitly requested side never silently becomes a top pickup. “From this side” without a named reference asks for clarification. Some sides are unreachable at the object's current position; the robot explains and asks before changing side.

The personality is playful, helpful and efficient. Empty-handed requests may combine short gestures or use a model-composed `gesture` with two to eight bounded position/orientation points and a slow, normal or quick tempo. Every movement is still checked and returns home. This freedom does not change object handling, move unrelated items or override collision checks. Try “a curious wiggle” or “do a little victory dance”.

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

The Token Plan endpoint rejected the unauthenticated browser preflight during testing. The GitHub version uses the relay at `https://bnta-robot-lab-connection.zhinii.chatgpt.site/api/chat`. The shared key is saved as the secret `ALIBABA_API_KEY` in the Site's environment settings. It is read only by the server and sent only to Alibaba; the frontend receives neither the key nor a key entry form. The application does not log keys, prompts or responses. Hosting/provider infrastructure is governed by those services' own policies.

To change the hosted connection, update the Site's server environment: `ALIBABA_API_KEY` (secret), and optionally `ALIBABA_BASE_URL` and `ALIBABA_MODEL`. Rebuild and deploy the Site after changing environment values. Match the key and model to the provider endpoint; Token Plan and regular Model Studio credentials are not interchangeable. The school package has its own command-line configuration and does not use the hosted key. [Alibaba connection guidance](https://platform.qianwenai.com/docs/developer-guides/clients-and-developer-tools/chatbox).

The frontend is entirely hosted on GitHub Pages. GitHub Pages cannot run the relay's server code ([GitHub documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)). The deployed route and pinned robot instructions are preserved in `server/relay-route.ts` and `server/relay-system.mjs` for migration to another HTTPS host. Install them as an App Router `app/api/chat/route.ts` and its imported `relay-system.mjs`, and set the server environment key. No database is required. After migration, update `RELAY` in `agent.mjs` and allow the GitHub origin on the new server.

## Execution and perception

The AI receives structured state from the same engine that renders the scene: object IDs, bilingual names, dimensions, origins, positions, orientations, clear top faces, stack suitability, obstacles, current gripper/pose, joint limits and undo availability. This is exact simulated perception, not camera vision. Unknown real-world objects are outside scope.

Actions are schema-checked and the complete task is preflighted against a copy of the world in a cancellable Web Worker. Motion checks joint limits, swept joint interpolation, the tabletop, fixed furniture, object clearance, gripper and held-object bounds. Transfers try direct elevated paths, a waypoint through the home area, and arcs around the base. Invalid plans do not partially execute. A missing pickup may be repaired once by the model. Physical reach, collision and support failures stop the task and receive a controller-generated explanation; the model cannot replace them with a different task. No arbitrary model code runs.

Named-object placement uses a `transfer` action that picks up the specified object when needed, carries it, and releases it. Consecutive transfers can stack an object and pick it up again to return it without the model having to manage each gripper transition. A different already-held object is still a conflict that requires a destination. Failed-plan feedback includes the step index and simulated held object. Requests use Alibaba JSON Object output mode, a bounded 2,000-token response, and one schema/truncation repair attempt.

The controller supports grasp/release; placement on clear table coordinates, organizer spaces, beside objects (left/right from the seated user viewpoint in the dorm), on a suitable flat support, or at a remembered starting position; Cartesian tool poses; explicit six-joint poses; X/Y/Z rotation; home; restore; undo; wave; bow; circle; up/down; and gentle/lively dance. Rotation uses roll/pitch/yaw components, with robot-local frame +X front, +Y right and +Z up. Rotated bounds are used for clearance and placement height. Turning and placing are separate reachability problems. Orientation completion messages come from the actual simulated state, and restore resets orientation as well as position. There are at most 12 actions per request and three repetitions per named gesture. Preset gestures coexist with model-composed Cartesian sequences.

Undo stores up to eight completed tasks and reverses their validated trajectories; a drop needs a newly checked retrieval plan. After a drop the robot tries a short local withdrawal and closes its empty fingers; it does not automatically retrace the full approach or return home between tools. A longer checked withdrawal is a fallback when the local route is blocked. Closely spaced motion samples play on one continuous timeline, so the arm does not pause at every sample. Up to four previously checked arm configurations are kept as optional solver seeds, with the original pickup retained. They are never replayed without collision checks and are excluded from the AI context. Requested object orientation is kept separately from measured IK pose, preventing tiny solver errors from accumulating when an item is placed. Restore handles stacked objects from the top down and can use an empty table region to resolve swapped starting positions. School objects use distinct sizes and grasp widths. A glue stick or ruler cannot be used as a stacking support.

The renderer and controller use shared physical geometry in `shapes.mjs`: book covers, pages and spines; writing-tool barrels, tips, ends and pen clip; the hollow holder walls and floor; organizer top and legs; laptop base, keys and tilted lid; and lamp base, stem and shade. Other school props use the same shared parts. The gripper housing, rails, carriers, fingers and pads, and the arm links, joints and caps are checked separately. Oriented convex-part tests follow the visible faceted geometry; broad bounding boxes only reject distant pairs. A 0.5 mm clearance is retained for unrelated parts, with 0.2 mm tolerance at deliberate grasp/support contacts. The entire writing-tool drop is checked against furniture, objects, gripper and arm at 1 mm intervals. Carried objects also clear the arm itself. Beside placements try progressively wider gaps and keep the smallest checked gap for the selected grip, instead of reserving a blanket 35 mm.

Natural placement orientations use `posture: "short-edge" | "long-edge" | "flat" | "upright" | "face-down"` on `place` or `transfer`. Short-edge/upright puts the longest dimension vertically; long-edge uses the middle dimension; flat uses the shortest dimension. Face-down flips a book 180 degrees onto a flat face. The controller can stand it briefly in a checked staging spot and grip its opposite face before final placement. Explicit numerical angles remain distinct from these natural posture choices. The controller selects a feasible facing and grip without substituting a flat Z spin for standing. Object orientation and offset are tracked relative to the gripper. A different grip requires a visible release on a support and a new pickup, never an attachment change in midair. Support height, collision geometry, jaw width, inventory and completion text use the resulting pose. Carried objects follow the actual tool frame throughout joint interpolation. Upright books are not broad stacking supports. Undo preserves grasp transforms and restore returns original orientations.

For reachable endpoints whose direct joint movement is blocked, a bounded deterministic joint-space search can suggest a detour. Its coarse samples never authorize execution: every accepted segment is rechecked at intervals of at most 0.5 degrees. Endpoint-only IK is used for the turn-over regrasp, with route validation kept separate. Ordinary Cartesian moves retain their direct-path checks. Pickup errors identify the item and failed stage; a rejected wrist candidate is not reported as the requested object angle. Generic shelf candidates are constrained to the shelf, including candidates generated beside occupied items.

Tests cover all four desk items standing on the middle shelf, both books resting on their long edges, the already-held notebook placed upright on the left shelf or back at its start, and undo/restore. Holder tests cover either insertion order, separately held tools, settled preview poses, retrieval and rejection of books or flat insertion. This does not guarantee every orientation at every location: a far shelf approach can still exceed the wrist range or hit the laptop. The simulation checks geometric support, not friction or balance.

This remains a simplified kinematic teaching simulator. The limited family of transfer paths and grasp candidates can still reject a physically possible task; the planner is not complete. Collision shapes match the shared solid meshes, excluding printed decals and engraved markings. Joint movement is sampled at up to 0.5 degrees, with finer Cartesian samples near the holder; this is not an exact continuous-time collision proof. It does not model calibrated dynamics, forces, friction, detailed object deformation, all robot self-collisions, or certify physical hardware safety. The school props are illustrative scaled models. The simulated joint ranges stay unchanged; the tool solver permits low grasp centres for thin objects while the world controller checks the actual gripper/table clearance.

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
