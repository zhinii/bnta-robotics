# Chat-driven Robot Lab — implementation and acceptance evidence

Implementation and pre-release verification, 21 October 2026. The default entry is `beginner-3axis/index.html`; its release URL is https://zhinii.github.io/bnta-robotics/beginner-3axis/.

The supplied brief's §2 and §9 were empty. The user explicitly said to ignore them for now. The checks below are derived from the requirements that were actually supplied; they are **not a claim to have passed an unseen §9**.

## Prototype-first sequence

The content-free `quest-prototype.html` and `quest-engine.mjs` were built and browser-tested first. The running prototype was linked and opened for the user before `quest-lessons.mjs` was connected. The prototype remains separate and contains no lesson content. `quest-lab.html` matches the complete default entry.

## Decisions where the supplied documents differed

- Lesson 1 uses free exploration of five robot bodies. Illustrated job matching remains optional, with saved discussion answers and no score.
- Route B in Lesson 6 is an optional extension. Reflection is available after the verified route to A. During B, examples, hints, Back-to-tour and historical target buttons are unavailable.
- Tours play automatically, but advance only when the learner chooses Next. There is no timed page advance.
- Reflection asks the supplied standard question, “What did you learn?” / “你学到了什么？” The learner's wording is saved without grading.
- The original bilingual content modules are preserved. Concept introductions, definitions and tour explanations are reused. Practice instructions that referred to old Assessment panels now name the corresponding chat actions; the Lesson 3 calculation check is optional.
- Controls and Program occupy the collapsed chat area. The header, Stop, contextual choices and composer remain available. Starting a new practice opens Controls; a learner's manual panel selection otherwise persists.

## Requirement-by-requirement checks

| # | Requirement | Result | What was clicked or typed, and what happened |
|---|---|---|---|
| 1 | Central quest-log conversation | PASS | Clicked Lessons, a lesson, words, Tour, Practice and Reflect. Each activity updated the same conversation and contextual reply area. No separate answer field appeared. |
| 2 | Input always available | PASS | Expanded and collapsed the log at 1280×800, 390×844, 320×568 and 844×390. The composer remained visible; there was no horizontal page overflow, and the scene retained space. Simulated a reduced visual viewport while typing; the composer stayed above its lower edge. |
| 3 | English and Chinese | PASS | Selected 中文 during a saved prediction draft; the draft remained unchanged and authored dialogue/chips switched language. Typed Chinese navigation and robot commands, including 课程, 导览, 下一步, 目标, 移动, 录制, 运行, 暂停, 停止 and 步骤. |
| 4 | Prompt cancellation and recovery | PASS | Typed a draft, used `/ask`, then `cancel` and `answer`. The original draft returned and had not become a prediction. Reloaded with an unfinished prediction; the prompt and draft returned. |
| 5 | Words and tours | PASS | Tapped robot vocabulary and observed a WebGL robot overlay. Used Next/Back through tour items. Arm tours used isolated simulator controllers; the learner's program and practical evidence stayed separate. |
| 6 | Lesson 1 | PASS | Selected all five robot bodies, replayed motion, optionally matched the illustrated jobs, then chose Reflect and saved a response. Job matching did not gate reflection. |
| 7 | Lesson 2 | PASS | Saved the J1 prediction and clicked J1 +10°. The real controller completed a J1-only ten-degree move, narrated the resulting position, and offered reflection. Saved a Chinese reflection. |
| 8 | Lesson 3 | PASS | Kept X/Y unchanged, increased the displayed Z by 10 and clicked Move. Coach reported the actual displacement, path distance, simulated time and average speed. Inspected joint changes; an incorrect optional calculation remained editable and a measured calculation passed. |
| 9 | Lesson 4 | PASS | Typed the supplied approach and pickup coordinates, closed the jaws, checked actual attachment, then lifted 10 mm. Only verified held-object motion completed the practice. Saved reflection in the same input. |
| 10 | Lesson 5 | PASS | Reset, enabled recording, performed the transfer, disabled recording and opened Steps. Moved a step down and back up. Reset, Run, Pause, Stop, Reset and Run completed the real recorded transfer. Coach automatically asked for one problem and improvement; the typed response and reflection were saved without scores. |
| 11 | Lesson 6 | PASS | Tried the direct carrying route: the controller rejected it and narrated the reason. Followed the clearance route to A; Reflect became available before B. Chose B, tried Hint and Back, and verified that the independent activity remained active and no historical target buttons remained. Recorded and replayed a route to B successfully. |
| 12 | Stop and validated execution | PASS | Used visible Stop and typed stop during operation/replay. Recorded steps remained. Preview changed only the target; Move ran the controller's existing collision and reachability checks. |
| 13 | AI is optional | PASS | Completed all six lesson journeys with the provider unavailable, then repeated all six with a mocked provider. Offline lessons made no AI request. Independent B suppressed AI help requests. |
| 14 | AI confirmation and failure | PASS | Mocked an AI target proposal and clicked Confirm. An unfinished prediction was not submitted by that action. Simulated a 503 response; the draft survived and the learner continued offline. Engine tests also changed robot state between proposal and confirmation and verified rejection of the stale action. |
| 15 | Saved work | PASS | Reloaded after finishing Lessons 4–6: the three completed attempts, evidence and nine-step program returned. Motion and recording remained paused. Clicked Menu → Export progress and received `robot-lab-progress.json`. Scene changes archive existing programs; the archive retains the latest 12 snapshots. |
| 16 | Existing source preserved | PASS | Compared `classic.html` with the previous committed `index.html`; its content matches. Older UI tests now target that preserved entry. The new save namespace does not overwrite earlier learner saves. Changes are confined to the beginner module. |

## Executed checks

- `npm test`: **127/127 JavaScript tests passed**.
- `npm run test:dom`: six new lesson journeys passed offline; preserved Guide integration also passed.
- `npm run test:lessons:ai`: all six new lesson journeys passed with mocked AI.
- Python server tests: **10/10 passed**.
- `tests/quest-prototype.browser.mjs`: content-free prototype, actual motion/recording/replay, paired commands, four layouts, keyboard viewport and no page errors.
- `tests/quest-lessons.browser.mjs`: real Edge/WebGL, Lessons 1–3, Lesson 4 draft recovery, language changes, AI confirmation/outage, export and responsive checks; no page errors.
- `tests/quest-practice.browser.mjs`: real Edge at 390×844, complete Lessons 4–6, program reordering, full replay, collision rejection, independent B and reload; no page errors.
- `git diff --check`: passed.

The browser scripts operate visible controls and the shared composer. Route coordinates come from the existing authored practice data; tests do not inject completion flags. The DOM journeys accelerate time while still using the actual controller and planner.

## Limits of the evidence

Mobile checks use desktop Edge at phone dimensions and a simulated keyboard viewport, not a physical phone. AI tests use controlled responses and outages; no live Qwen request or credential change was made. The simulator remains geometric: it does not model force, gravity, friction or impacts. Export is available in the new chat interface; the older import tools remain in `classic.html`.

These results establish the tested build. GitHub Pages publication is a separate deployment step; publication should be verified against the deployed entry and module files.
