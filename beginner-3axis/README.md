# BNTA Robotics · Three-axis learning lab

An isolated beginner entry for **Robot Lab, developed by Christopher Hansen**. The original six-axis simulator and all nine original repository files are unchanged. Open `beginner-3axis/` directly; the original root application remains separate.

## Classroom HUD preview (local feature branch)

The classroom redesign is on `codex/classroom-game-interface`. It has **not been published**. See [GAME_REVIEW.md](GAME_REVIEW.md) for the feature map, verification scope and limitations, and [the screenshot review](review-game/index.html).

The default screen is **Explore** with recording off. The Guide menu opens six lessons and three challenges. **Guide / Controls / Program** share one persistent chat input. The 3D scene stays visible above the scrolling panel on phones. Design and graded assessments are deferred; their source and historical records are preserved.

Lessons use the supplied bilingual `curriculum.mjs` content and the existing vocabulary and tour units: **Words → Guided tour → Practice → Reflection**. Words can be explored in any order. Tours play isolated demonstrations; Next advances at the learner's pace. Practical checks require actual controller events. Predictions, calculations, program notes and reflections use the shared input; no score is assigned to the learner's reasoning.

## Movement and program controls

XYZ sets a world-position target in millimetres; press Move to execute it. Joints turns one joint to a selected angle in degrees. Jog moves the actual TCP one selected 1, 5 or 10 mm step per tap along a world axis. All three modes use collision checking and can record completed movements when Record is on. Jog does not use a pending XYZ target. Joint movements replay as joint movements, preserving their curved tool path; they are not silently converted to straight XYZ moves.

Program playback, Pause and Stop remain available with the controls. Explore's Test restores the recorded starting scene; Learn's Run requires the learner to Reset deliberately. The Guide menu opens save/load and evidence export. Model notes remain in this document.

## Run locally

From the repository root:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000/beginner-3axis/` in a current WebGL2-capable browser. To test a GitHub Pages-style project subpath, serve the parent of the repository and open `/bnta-robotics/beginner-3axis/` (or the actual checkout folder name). Assets and module imports are relative. Do not open `index.html` through `file://`.

No application build, backend, account, runtime package installation or network API is required for lessons, operation, reflections or JSON export. Optional AI assessment feedback uses the separate server described below. Three.js is pinned and served locally. With WebGL2 unavailable, the page explicitly reports the limitation and keeps text coordinates and controls available; this is not a working 3D view.

## Persistent Guide: offline and AI

Guide is the shared navigation and conversation panel. Its input stays available in Guide, Controls and Program. The menu opens modes, six lessons, challenges, movement/recording commands, view settings, language and save/export. Typing offers up to three English/Chinese command suggestions; selecting a suggestion fills the input without executing it. Coordinate examples are editable drafts.

When a lesson requests an answer, the send button becomes **Save**. `/ask …` asks a question without submitting an answer; `/help` opens help, and `/controls` opens controls. `cancel` pauses answer entry while retaining its draft; `answer` resumes it. Stop, Pause, Help, Status and language commands remain available during answer entry. Drafts survive reload and language changes. Suggestions are suppressed while typing a free-text answer.

Lesson commands include `words`, `word 1`, `tour`, `next`, `back`, `practice`, `prepare`, `inspect`, `calculate`, `program note`, `changed task`, and `reflect`. The equivalent action chips call the same dispatcher; a lesson-action menu is under All commands → Learning & help. English and Chinese commands are supported.

The six practice checks are: five ungraded robot/job choices; a J1-only ±10° turn; a +10 mm Z move with unchanged X/Y and calculation from measured displacement, distance and simulated time; confirmed grasp and a 10 mm held lift; a recorded transfer to A, actual Pause/Stop, complete replay and problem/improvement note; and a rejected direct carrying path, successful detour to A, then independently recorded replay to B. Reflection completes a lesson only after its practical checks pass. Destination B retains coordinates and controller feedback but pauses route hints, examples and AI coaching.

All listed commands work offline, including `lesson 3`, `task 1`, `controls`, `program`, `target 120 -80 100`, `move 120 -80 100`, `open`, `close`, `record on`, `record off`, `save position`, `run`, `pause`, `stop`, `reset`, `why` and `language zh`. XYZ values are millimetres; Joints and Jog open their precise controls. `target` previews; `move` executes through the existing checked controller. `home` resets the camera, not the robot. `why` reports the latest controller rejection. Program editing remains in Program.

On phones, the conversation and menus scroll within their panel while the scene, three panel buttons and input remain available. The latest guidance is brought into view when opening Guide. Stop remains in the header. Touch targets remain at least 44 pixels; the keyboard layout uses the visual viewport.

With the optional Qwen school server, open-ended requests can return an explanation or one proposed command. The Guide displays the exact command and requires **Execute command** or **Cancel**. Proposals never execute automatically. Both typed and confirmed AI commands use the same dispatcher and simulator checks. A changed robot/activity context discards stale proposals; the AI cannot award completion or bypass collision checks. An AI outage returns the indicator to Offline and keeps commands working. The latest unanswered question is saved in project state and can be retried from Guide or Menu after checking the connection.

The bilingual language selector controls new guidance and AI replies. Conversation text is retained as authored. AI questions send a bounded robot/activity snapshot and recent AI conversation through the existing school server; credentials remain server-side.

## Optional AI server

**Without AI:** The guide is labelled Offline guide. Lessons, hints, assessments, reflections, movement and JSON export work without a provider. No generated answers are implied.

**With a configured school server:** the same Guide input also accepts open-ended questions and action requests. The `/api/guide` endpoint returns text and an optional command proposal; `/api/assessment` remains available for assessment feedback. No key is shipped in browser files. Live Qwen use was not tested for this local redesign; labelled provider mocks and server tests cover the contract.

Run the optional same-origin server from the repository root:

```sh
python beginner-3axis/server/serve.py --host 127.0.0.1 --port 4205
```

Open `http://127.0.0.1:4205/beginner-3axis/`. With no key this is an offline preview. On the school server, it can reuse the existing `QIANWEN_API_KEY`, `QIANWEN_BASE_URL` and `QIANWEN_MODEL` environment settings. No key belongs in browser code or Git. See [server/README.md](server/README.md) for the connection contract, limitations and verification steps. GitHub Pages alone cannot run this server.

## Test

Node 24 was used for verification. The production app uses browser ES modules; Node rendering tests use Node 24 module hooks to reproduce the import map.

```sh
node --test beginner-3axis/tests/*.test.mjs
sha256sum -c beginner-3axis/baseline.sha256
```

Optional DOM integration uses jsdom, strictly as a development dependency:

```sh
cd beginner-3axis
npm ci --ignore-scripts
npm run test:dom
npm run test:lessons:ai
```

The optional server has ten mocked provider/security tests: `python -m unittest discover -s beginner-3axis/server -p "test_*.py" -v` from the repository root.

Guide verification: `node tests/guide.dom.mjs` from this module exercises the real page/controller with offline and mocked-AI responses. `node tests/guide.browser.mjs` additionally checks responsive layouts in headless Edge; it needs Playwright and a localhost preview. Optional `BNTA_PLAYWRIGHT_PATH`, `BNTA_PREVIEW_URL`, `BNTA_SCREENSHOTS` and `BNTA_PYTHON_PATH` configure that browser check. When the Python path is supplied, the check starts and stops its own preview server with the provider key explicitly empty.

The DOM harness completes all six lessons using actual page handlers and controller events, both offline and with a labelled mock AI provider. It checks practical evidence, draft capture, independent-task restrictions and JSON/text export. Older `tests/game.dom.mjs`, `tests/ui.dom.mjs` and `tests/tutor.dom.mjs` describe earlier interfaces and are retained as historical fixtures. **jsdom does not test pixels, layout, WebGL, real keyboard focus trapping, touch, or physical devices.** The normal unit suite does not need jsdom or npm installation. A test-only `BNTA_JSDOM_PATH` override can point to an already-installed jsdom module.

## Mechanism and coordinate contract

- Model ID: `bnta-educational-3r-v1`. Educational geometry, not calibrated hardware/CAD.
- Millimetres; right-handed base-fixed XYZ; +Z up. Internal joint angles are radians.
- J1: base yaw, −150° to +150°. J2: shoulder pitch, −30° to +120°. J3: elbow pitch, −150° to −10°.
- Shoulder height 80 mm; upper arm 120 mm; forearm 100 mm; fixed collinear tool-centre offset 20 mm.
- Exactly three positioning joints and a separate open/close gripper. The tool frame follows J2+J3. There is no wrist compensation or independent orientation control.
- Only the negative-elbow IK branch, positive radial reach ≥40 mm, and explicit singularity rejection are accepted.
- Home joints `[0°, 60°, −90°]`; gripper open. Jaw clear gap 18 mm open / 12 mm closed; part sphere radius 6 mm.
- Source and destinations are derived from FK: `[-30°,45°,−90°]`, `[30°,45°,−90°]`, and changed destination B `[45°,45°,−90°]`.

### Motion and simplified geometry

A requested move is a Cartesian TCP segment, preflighted before any live state change. Samples are spaced ≤1 mm and ≤0.25° per joint; each accepted interval executes the same piecewise linear joint interpolation that was checked. Small between-sample TCP deviations from the ideal Cartesian line remain; the conservative geometric envelope covers the executed interval.

Each interval expands its start proxies by `260 × sum(abs(joint delta in radians))` plus 0.5 mm. Conservative failures subdivide down to 0.0005 mm or depth 18. Plans exceeding 10,000 subdivision nodes reject rather than lowering quality. Animation is bounded by 30 mm/s sampled TCP travel and 30°/s per joint. These are display settings, not actuator dynamics.

Checked proxies include the fixed base, floor, upper arm, forearm, palm, fingers, held part and solid obstacles. Upper-arm/forearm self checking trims 12 mm at their intentional elbow connection; upper arm is checked against the distal tool and held part. The collinear forearm/tool connection and the identified fingers touching their attached part are intentional connections/contacts. Capsule-vs-expanded-AABB corner geometry can conservatively over-reject. Finger opening/closure is also preflighted with conservative swept padding. Visual decorative housings are labelled educational rather than solid contact geometry. The visible obstacle matches the checked box exactly.

The UI says “Path checked against simplified geometry”, not “collision safe”. No force, torque, payload, friction, gravity, dropping, collision damage, industrial safety or physical-sensor model is claimed.

### Virtual grasp and support

Wireframe markers are abstract support/capture fixtures. Pickup requires the actual part centre within 2 mm, forward-axis alignment within 10°, a compatible opening and a collision-free jaw closing sweep. Any collision-free approach is accepted; there is no hidden corridor or waypoint prerequisite. Legacy approach metadata is validated when loading older files but is not required to grasp. A held part preserves its actual local transform and tilts with the tool. No snapping occurs. Opening while held is accepted only at a known compatible fixture; free dropping is intentionally not simulated.

## Controls and recording

- Plus/minus and typed numbers edit **Target only**. Current comes from actual FK. **Move** is the commit action; rejected movement leaves the scene and program unchanged.
- Learn and Explore share the same mechanics. Recording is OFF on entry and reload.
- When ON, a successfully completed manual move or state-changing gripper action adds one named step. Preview, view controls, playback, failures, no-ops and interrupted motion do not record.
- Run checks the actual scene against the captured program start, preflights the full program, and does not silently reset. Reset deliberately restores the captured start and keeps steps/evidence.
- Pause freezes the exact timeline; Run becomes Resume. Stop invalidates the operation and preserves its partial scene. After an interrupted recording, reset/replay to the known end, or explicitly clear and start again.
- Steps opens a compact side-panel list while the robot stays visible. Select a position for its target ghost and details; rename/reorder/delete revalidates the full sequence. Reset and separately confirmed Clear are visible at the top. The common Run/Pause/Stop bar remains available.
- Joint demo previews a single joint angle; **Move joint** uses a checked joint-linear path, with other joints fixed. It never records; XYZ controls are disabled while it is active. A nonempty program must be cleared deliberately before entering the separate demo.
- Camera Orbit, Grid, Axes and Home view never change the robot frame or program.

## Learning and privacy

The Guide menu offers three challenges: **Reach a point**, **Pick & place**, and **Avoid an obstacle**. Task references contain coordinates and hints; Use target previews a position without moving the robot. Current coordinates stay outside the canvas so they cannot cover the tool.

Explore's **Reset & test** explicitly restores the recorded starting scene and runs the program after preflight succeeds. Recording turns off for replay. Learn retains its separate, strict Run/Reset teaching behavior. Completion requires a successful recorded replay that meets the selected exercise's goal; manual positioning alone does not complete it. Completed programs and final scenes are retained per task in exported project JSON. Switching tasks warns before clearing the current program and offers Save JSON.

On phones, the scene stays above the independently scrolling Guide, Controls and Program panels. The shared input stays outside those scrolling areas. Desktop uses a side panel.

Examples in Lessons 1–6 now show a numbered action list with a synchronised current-step highlight. On phones, programming keeps a compact scene; replay (including Pause) enlarges it and exposes playback controls. World axes originate at the model's (0,0,0), with larger directional arrows and a tighter camera fit.

Saving a prediction enables practice setup. Preparing a practical lesson archives any nonempty program before resetting the scene; confirmation explains that change. Teaching and answer entry bring Guide forward. Practical operation brings Controls forward, except the J1 activity whose two movement chips stay in Guide. A manual panel choice persists until the next activity transition. The chat input remains available throughout.

Lesson 1 pairs each robot's concept with its Three.js demonstration: articulated, gantry, SCARA, delta, then mobile. Their motion and graphics are separate from learner state. A wrist-axis comparison illustrates another articulated arm; the programming robot remains the three-axis model. Bold vocabulary terms open bilingual definitions. The supplied task text is preserved, including its earlier “Assessment” wording; in this interface those calculation and problem/improvement responses are entered in Guide.

The remaining lessons use short concept/demo pairs before practice. Learners can replay examples and revisit words. Lesson 1's five illustrated job choices are saved for discussion without grading; the illustrations are original explanatory graphics.

Six core lessons introduce body plans, anatomy, joint-vs-XYZ movement, grasping, recording/replay and obstacle planning. `lesson-flow.mjs` owns the flow and practical requirements; `game-learning.mjs` retains legacy attempts and assessment logic. Assessments and Design are disabled by default. Their configuration switches and historical code are preserved; enabling those older interfaces requires separate acceptance testing.

The changed-target attempt uses destination B, a new recorded program and an actual successful replay ending with a supported release. New hints, examples and AI requests are paused until B is complete. Earlier conversation remains in history. Fixture coordinates remain available as task information.

English and 简体中文 use paired offline dictionaries, including the lesson framework. Learner-written names and reflections are preserved as authored. Significant errors/completions use a polite status region. The app uses semantic controls, confirmation dialogs, focus styling, reduced-motion support and responsive CSS. See LOCAL_VERIFICATION.md for measured browser checks; physical-device and full assistive-technology acceptance remain separate.

Only the new local key `bnta3axis:v1` is used as a convenience copy. The old application's data is never read, migrated or cleared. Recording never restores ON. Bad/stale stored data is retained and blocks overwrite; quota/privacy failures keep the current session usable and visibly request an export. Save project JSON includes a validated resume payload, and Open project JSON validates before confirming replacement of current work. No server database is used.

Core attempts keep practical check event IDs, up to 40 supporting event snapshots, word visits, job choices, measurements, predictions, calculations, program notes and reflections. JSON and readable text exports include those records; JSON also retains response drafts. Conversation history retains the latest 150 turns. Names are optional. There is no analytics or hardware connection. Saving an answer is local and does not automatically send it to AI. An explicit AI question sends recent AI discussion and a bounded activity snapshot through the school server to Qwen, including saved lesson responses and measurements but excluding the learner-name field. The server does not store conversations or log their content.

## Brief revision and reusable teaching framework

Read [BRIEF_REVIEW.md](BRIEF_REVIEW.md) and [TEACHING_FRAMEWORK.md](TEACHING_FRAMEWORK.md) for the earlier learner audit and assessment design. The six-lesson implementation described above supersedes their default interface flow. Examples use isolated controllers and never contribute student completion evidence. Earlier stored attempts remain compatible.

Ghost shows the target arm pose. A dashed blue line shows expected TCP travel; the program panel shows the whole saved route. Red indicates an invalid move/program, not simulated impact. The orange trail follows actual movement and can be hidden or cleared. These overlays do not move the robot or change a program. The gripper now has a connecting slide bridge included in collision checks.

## Dependencies and attribution

Runtime renderer: official **three@0.180.0**, MIT, from `https://registry.npmjs.org/three/-/three-0.180.0.tgz`. Copied unmodified:

- `vendor/three/build/three.module.js`
- `vendor/three/build/three.core.js`
- `vendor/three/examples/jsm/controls/OrbitControls.js`
- `vendor/three/LICENSE`

Registry SHA-512 integrity, tarball SHA-512 and individual SHA-256 hashes are recorded in [vendor/three/PROVENANCE.json](vendor/three/PROVENANCE.json) and tested. The browser import map binds `three` locally; the original minified root bundle is never imported. jsdom@26.1.0 is pinned in package-lock.json for development-only DOM checks.

Robot Lab — developed by Christopher Hansen. Original MIT copyright/permission and Three.js/cannon-es notices remain at the repository root unchanged. This additive educational variant retains that attribution. No FAIRINO affiliation or physical hardware certification is claimed.
