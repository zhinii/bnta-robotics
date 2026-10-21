# Classroom HUD implementation review

## Six conversational lessons — 21 October 2026

This section supersedes the default lesson/assessment interface described in the historical reviews below.

- The supplied bilingual lesson content now drives six lessons: Words → Guided tour → Practice → Reflection. The tours play isolated demonstrations and wait for Next. Graded questions, scores and Design are deferred; historical records and source remain available.
- Guide / Controls / Program share a persistent composer. Predictions, measured calculations, problem/improvement notes and reflections are entered there. `/ask` requests help without submitting an answer. Cancel retains the draft; Resume response restores it. Reload and language changes preserve drafts.
- Practice completion requires actual controller evidence: J1 ±10°, upward 10 mm with fixed X/Y and checked calculations, actual grasp and 10 mm lift, recorded transfer with Pause/Stop/full replay, and obstacle rejection plus A delivery followed by independent replay to B.
- Independent B blocks new examples, route hints and AI coaching while keeping coordinates, commands and controller feedback. Starting a fresh guided practice resets the independent task.
- `lesson-flow.mjs` stores flow state and validates practical events. Recording events without a scene snapshot no longer prevent saving. Event IDs resume beyond saved attempt floors after reload. JSON and readable text export include the new evidence and responses.
- Learn uses strict Run; Explore retains Test with automatic reset. The label now reflects that difference. Chat reports actual Object held state, separately from the gripper being closed.
- 122 JavaScript unit tests and 10 Python server tests passed. All six lessons completed through real DOM/controller handlers offline and with a labelled mock AI provider. Guide tests cover stale/invalid proposals, explicit confirmation, failure and retry.
- Headless Edge checked desktop 1280×800, phone 390×844 and 320×568, landscape 844×390, and tablet 820×1180. All six lesson panels were exercised on the phone viewport; browser tests include saved prediction drafts, reload after setup, Chinese prompts, actual J1 operation and reflection, retained scene/input, simulated keyboard viewport, AI proposals and outage fallback. No page errors.
- Screenshot evidence: `robot-arm-lab/test-artifacts/conversation-lessons/`. Screenshots were inspected for the job card, Chinese prediction and practical target panel.
- Live Qwen, physical phone keyboards/touch and screen-reader acceptance remain unverified. The local preview has AI disabled. No commit, push, merge or publication was performed.

## Persistent Guide verification — 20 October 2026

- Guide input remains in Guide / Controls / Program. Modes and commands live in the scrollable Guide menu; typed English/Chinese suggestions fill the input without executing.
- Offline command execution, controller failure explanations, recording, real movement, saved questions and history were exercised through the actual page/controller.
- Qwen integration uses `/api/guide` and the existing server configuration. Proposed commands require explicit confirmation, reject invalid/stale responses and use the same dispatcher as offline commands. Connection failure preserves the question and leaves offline operation available.
- 117 JavaScript unit tests and 10 Python server tests passed. Practical lessons 2–7 passed through the DOM harness, including the mocked-AI variant. The dedicated Guide DOM journey passed.
- Headless Edge passed at 1280×800, 390×844, 320×568, 844×390 and 820×1180; English and Chinese menus, persistent input, visible scene, touch target sizes, simulated visual-viewport keyboard resize, real movement, AI confirmation and outage fallback were checked. No page errors. Screenshots are in `robot-arm-lab/test-artifacts/conversation-guide/`.
- Live Qwen requests, physical phone keyboards/touch and screen-reader acceptance remain unverified. Preview uses no API key. These changes are local; no commit, push, merge or deployment was performed.

Local feature branch: `codex/classroom-game-interface`. No merge, push or deployment performed. Changes are restricted to `beginner-3axis`. The original root app is unchanged.

## Existing features and their new homes

| Existing capability | New location / behavior |
|---|---|
| Three-axis arm and separate gripper | Same planner, geometry and collision checks; orange/graphite/cyan visual treatment |
| XYZ, joints, jog | Compact Controls HUD; units remain millimetres versus degrees |
| Ghost, actual trail, expected path | Scene controls remain available |
| Recording, program list and editing | Record and Steps at the top of Controls; existing rename/reorder/delete retained |
| Save position | Explicit + Position captures the actual pose without moving it; resulting sequence is revalidated |
| Run, Pause/Resume, Stop, Reset | Visible above movement controls, plus Stop in the header; Reset retains the program |
| Seven lessons and examples | Learn dialogue uses existing vocabulary, concept units and isolated executable demos; short checks replace dense quiz panels |
| Three exercises | Challenge selector; completion still requires verified replay and a valid final goal |
| JSON, text and scene-image export | Save / load; new lesson attempts and design evidence are included |
| Optional Qwen feedback | Ask AI when the existing server reports configuration; authored guidance remains the default |

## Implementation

- `classroom.mjs`: original procedural room, daylight windows, shelves, workshop furnishings and workbench. No external texture/image requests. Demonstration models retain the room, with their own appropriate kinematics.
- `game-learning.mjs`: authored bilingual goals, answers, graduated hints, attempt accounting and event checks.
- `game-ui.mjs` / `game-ui.css`: HUD, guide avatar, contextual controls, dialogue history, lesson phases, challenge goals, design versions and optional AI conversation.
- Existing root files and original six-axis application were not edited.
- Gantry: three linear axes. SCARA: demonstrated planar rotation and vertical slide, with tool rotation explicitly not demonstrated. Delta: three-translation parallel mechanism. Six-axis arm: six forward-kinematic rotary transforms, including visible wrist roll. These are demonstration models, not interchangeable learner-program configurations.

## Evidence and persistence

Each attempt keeps the first submitted choice, every committed answer (maximum three), eventual correctness, hint/replay counts, practical evidence IDs, prediction, calculations and reflection. Original wrong answers are never replaced by later correct ones. First-answer accuracy is correct first submissions divided by answered attempts, unavailable before any answer. New runs retain earlier attempts.

Stable events include `MOVE_COMPLETED` (before/after joints, target, path distance and simulated duration), `POSE_SAVED`, `PROGRAM_STEP_SELECTED` (including step type), `OBJECT_ATTACHED`, the existing release events, `MOVE_REJECTED` / `ACTION_REJECTED`, `RUN_COMPLETED` and `ANSWER_SUBMITTED`. Event floors, phase checks and deduplication prevent stale or wrong actions from advancing practice. Type examples are labelled observations, not practical-operation evidence.

Challenge success requires the relevant scene and recorded program, at least two moves, and the final goal. Pickup tasks also require a supported release at the destination. A finished but unsuccessful run does not pass.

Design supports the existing source and destinations A/B. Changing the setup asks first and archives the current program. Saved versions can be restored after confirmation; tests preserve their scene/program, and the latest three scene images are embedded in JSON. A design conclusion is the learner's reflection, not an automatic claim of real-world effectiveness.

Browser storage is a convenience copy, not a database. JSON is the portable save. File size/structure and program geometry are validated when importing. Limits: 300 lesson attempts, 30 design versions, three images, 12 MB JSON. Export periodically; large portfolios can reach browser storage quotas.

## Verification performed

- 110 Node model/logic tests passed, including all three exercise solutions, grasp approach/contact, recording, reset, pause/stop, collision planning, existing delta/SCARA mechanisms, six-axis link lengths/wrist roll, scoring, deduplication and invalid-import rejection.
- New DOM journey completes practical lessons 2–7 through visible DOM controls, including actual pickup, obstacle route, recorded replay, displacement/distance/speed calculation and reflections. It also checks wrong-action rejection, three-wrong-answer assistance, model-switch program preservation and design version creation. DOM tests do not establish pixel layout or touch acceptance.
- Optional AI was tested with a labelled mock; six Python server/provider/security tests passed. No real Qwen request was made.
- Browser: completed Lesson 1's prediction/check/reflection; built and replayed the Reach mission; checked pause/resume and Stop; confirmed the obstacle mission can grasp at its displayed pickup coordinates; saved a design version, test and image. Screenshots show actual UI states.
- Exported a portfolio through the browser and validated the downloaded JSON with the actual import parser: accepted, including lesson attempts, four saved design versions and one embedded scene image. Final local preview: `http://127.0.0.1:4211/beginner-3axis/`.
- Responsive inspection: 1280×800 desktop, 390×844 phone portrait, 844×390 phone landscape, 820×1180 Chinese tablet. Keyboard Enter on Jog moved the actual TCP; phone controls scroll separately while the scene remains visible.
- Measured browser animation-loop cadence samples were about 100–108 callbacks/second on this computer. This is UI RAF cadence, **not GPU FPS or a low-end-device benchmark**. Compact/narrow devices use a capped pixel ratio and reduced shadow effects.

## Outstanding acceptance checks / limits

- Physical phone/tablet touch, screen-reader navigation and low-end GPU performance have not been tested.
- All core files are local; the DOM journey runs with network requests rejected. Browser-level network-disconnection emulation was not available in the inspection tool. The local browser showed AI offline and continued normally.
- Live Qwen dialogue requires the school server configuration and remains unverified here. The guide must never be treated as an AI grader.
- Simulator physics remains geometric: no gravity, friction, force, payload, impact or real-machine safety certification.
- Open Design is a constrained workbench configuration, not a free-form CAD/physics editor.
- Historical `tests/ui.dom.mjs` remains a legacy UI test; `npm run test:dom` now targets the redesigned dialogue. Existing model tests remain the regression baseline.

## Assets

Classroom geometry, HUD/avatar and authored illustrations are original repository code under the project's existing license. Three.js remains the locally vendored pinned dependency with its existing MIT license notice. No generated image, external font, licensed game art or remote asset was introduced.

## Responsive workspace audit — 19 October 2026

Local review only; no GitHub push or deployment. The scene now has a reserved region and a single Guide / Controls / Program workspace with a fixed action dock. Mobile XYZ inputs and landscape jog buttons were condensed without reducing action targets below 44 px. Help/history are available through ?. Practice setup stays visible before switching to controls, and verified actions explicitly direct learners back to Guide.

Screenshot evidence, exact viewport sizes, findings, and remaining physical-device checks: [Responsive UI audit](review-ui/index.html). The audit exercised actual browser movement, recording, preview, playback, pause/stop, practical lesson setup, bilingual controls, invalid-target feedback, and design input. 110 Node tests and the seven-lesson DOM journey passed. Real mobile touch/keyboard/notch behavior and live Qwen remain unverified.
