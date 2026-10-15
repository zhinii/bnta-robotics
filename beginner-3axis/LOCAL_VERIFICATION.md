## Fitted examples, robot mechanisms and familiar applications — 12 October 2026

- Watch example now fits the square scene and its explanation/sequence into the available view in all seven lessons, including the five robot types. A shared fitter accounts for sticky navigation, internal scrolling and viewport changes. It retains the fitted view after completion so results can be read. On short screens the steps can scroll while the scene and playback controls remain available. The active step follows within that text rail; intro-to-live caption changes do not enlarge the canvas and move buttons under the pointer.
- Delta: taller mechanism, smaller fixed platform, slender paired rods, connected joints, and two rear supports for a clearer view. SCARA: stacked links, a supported vertical slide, separate lift/travel/lower/release/withdraw phases, and shorter fingers that clear the receiving socket. These remain illustrative kinematic demos, not a full industrial collision/physics solver.
- Added bilingual familiar examples: car building, printing a keyring, assembling small parts in electronics (electronic toys as the familiar connection), snack packaging and lunch delivery. These are context examples, not claims that each visual reproduces a specific installation. References: [KUKA car-body welding](https://www.kuka.com/en-us/applications/automated-welding/spot-welding), [Prusa Cartesian printers](https://help.prusa3d.com/article/types-of-printers-and-their-differences_112464), [Epson electronics assembly](https://news.epson.com/case-studies/delta-systems-scara-6-axis-robots), [ABB snack packaging](https://www.abb.com/global/en/news/105540/cstmr-pretzel-maker-uses-abb-robots-to-double-packing-productivity), [UT Dallas food delivery](https://services.utdallas.edu/dining/delivery).
- Verification: 91 Node tests pass, including fixed link lengths, continuous paths and 1,001 sampled SCARA insertion/withdrawal poses with socket/finger clearance. Seven-lesson DOM journey passes. Browser checked all seven demo openings at 390×844; scenes and text panes fit below sticky navigation with no horizontal overflow. Also checked 320×568, landscape 568×320 and desktop; rotation refocuses correctly. Short-screen content scrolls rather than shrinking text. Visually inspected Delta movement and SCARA placement using the visible motion scrubber. No physical-device or live-AI test; no deployment.

## Action, navigation and information color hierarchy — 12 October 2026

- Added a shared semantic theme for Learn and Explore: neutral app header; quiet lesson numbers and stage selectors with selected underlines; solid blue primary lesson actions; outlined secondary actions; flat gray readouts and references. Vocabulary remains bold and underlined, and disclosure labels are visibly interactive. Existing compact dimensions and square scenes are preserved.
- Guidance and the currently running example step use amber. Completed demo steps and successful controller feedback use green; failed movement feedback uses red with its existing explanation. Demo state comes from actual playback state, not a guessed text match. Disabled controls are muted, and keyboard focus has a distinct outline.
- Verification: all 90 Node tests and the seven-lesson DOM journey pass, including playing/stopped/completed demo state checks. Browser exercised a real move, an unreachable target, recovery, demonstration start/stop, and navigation in Learn and Explore. Checked 390×844 phone, 820×1180 tablet and desktop layouts; phone/tablet have no horizontal page overflow. This is browser viewport testing, not physical-device acceptance.
- Local preview: http://127.0.0.1:4205/beginner-3axis/ . No push or deployment.

## Square views, view switches and persistent lesson navigation — 12 October 2026

- Trail and Expected path are labelled checkboxes attached to the top-right of the practical/demo canvas and Explore canvas. They use the existing renderer/controller settings, preserve learner programs, and no longer consume space below the practical controls. Further reduced text-container padding.
- Arm/example/robot-type canvases use a 1:1 aspect ratio. Phone programming keeps a smaller square and replay uses a larger square. Short phone windows allow page scrolling rather than hiding the controls. Desktop Explore reserves room below its square for coordinates and fixture references.
- Replaced duplicate lesson-card arrows and bottom Back/Next controls with a single top lesson-navigation bar. Its contextual next-action label is retained, with explicit Next / Start assessment wording. Navigation sticks below the app header on phones and to the inspector top on desktop; advancing scrolls the new concept into view. Applied to all seven lessons, without changing assessment requirements.
- Verification: 90 model/unit tests and the full seven-lesson DOM journey pass. Added DOM checks for one navigation bar, removed duplicate controls, checkbox placement and toggle behavior. Browser checked 390×844 and 1280×900: practice canvas 253×253, example canvas 349×349, desktop Explore 640×640, with fixture references still visible. Scrolling a phone lesson kept navigation at y=44; actual next/back actions and overlay toggles were exercised. No physical-device test or live AI test.
- Local-only preview remains http://127.0.0.1:4205/beginner-3axis/ . No GitHub push or deployment.

## Screenshot-driven density correction — 12 October 2026

- Reduced actual navigation/control minimum heights after the marked screenshot showed that padding changes alone left tall rows. Header: 44px; numbered lesson buttons: 32px; phase buttons: 34px; assessment stages: 32px; movement inputs/buttons and footer: 34px. Removed the extra margins before the practice-step disclosure and kept playback labels on one line.
- At 374×852, measured the lesson bar shrinking from 60px (including its unwanted horizontal scrollbar) to 36px, assessment from 44px to 32px, and movement buttons from 53px to 34px. The scene starts roughly 100px higher. Body teaching text remains unchanged. This supersedes the earlier 44px minimum-control note below.
- Browser checked compact lesson navigation, target fill and actual movement, independent control scrolling and Explore fields with no horizontal page overflow. Only CSS changed in this correction; model/DOM suites were not rerun. Phone/tablet viewport inspection does not constitute physical-device testing.
- Screenshot: ../test-artifacts/dense-learning-phone.jpg in the parent project workspace. Local preview remains on port 4205; no push or deployment.

## Compact Learn and Explore layout — 12 October 2026

- Replaced the visible lesson dropdown with a numbered 1–7 bar and a highlighted current lesson. Full bilingual names remain available to assistive technology and on hover. Restart is a labelled icon; the existing scene-reset confirmation is preserved. Buttons remain stable during rendering and are disabled during movement/demonstrations.
- Phase navigation sits immediately below the lesson bar. Tightened card padding, concept headings, captions, vocabulary, assessment controls and demonstration lists. Desktop Lesson 5 now shows all nine example actions beside the scene at 1280×900. Explore has denser controls and a larger phone scene (253 CSS px at 390×844).
- Phone practical-stage transitions retain the lesson navigation rather than scrolling it offscreen. Controls scroll independently under the scene. Main operation buttons retain 44px height.
- Browser checks at 390×844, 820×1180 and 1280×900: numbered lesson switching, English/Chinese navigation, concept/example layout, practical prediction-to-operation transition, Explore movement, demonstration highlighting and disabled navigation while playing. No horizontal page overflow in the measured phone views. These are browser viewport checks, not physical-device touch tests.
- Verification: 90 Node tests and the seven-lesson DOM journey pass; the journey now uses the visible numbered lesson buttons and checks the current highlight. Optional tutor DOM checks pass with controlled responses, not live Qwen.
- Local preview remains http://127.0.0.1:4205/beginner-3axis/ . No GitHub push or deployment in this change.

## Visible demonstrations and adaptive mobile playback — 12 October 2026

- Lessons 2–6 show the complete example sequence with numbered actions, a green current-step highlight and a NOW readout driven by the isolated demonstration controller's command index. Completed steps retain a distinct state. Lesson 1 uses the same display for each robot type's four motion phases. These displays cannot modify learner evidence. Lesson 7's redesign remains on hold.
- On phones, practical programming uses a compact scene. Actual replay expands it, including while paused; irrelevant editing fields are hidden while Reset/Resume/Pause/Stop/Steps remain accessible. Demonstrations use a larger scene and a two-column step list. Captions remain outside the robot canvas.
- Replaced the offset decorative triad with world-coordinate arrows starting exactly at (0,0,0), including +X/+Y/+Z and negative X/Y. Labels are anchored at arrow endpoints without white cards. +Z reaches above the home robot. Camera fit uses tighter margins while retaining required arm, fixture, obstacle and axis geometry.
- Verification: 90 Node tests pass, including exact world-origin/arrow-tip checks and camera framing across compact and tall viewports. The full seven-lesson DOM journey passes with added checks for all demo commands, active-step highlighting, completion, replay enlargement and pause retention.
- Browser: at 390×844, watched Lesson 5 with all nine numbered actions visible, recorded a real movement, reset, ran and paused playback, then stopped/reset. Scene height measured about 106 CSS px while programming and 212 CSS px during paused replay; controls remained visible with no horizontal overflow. Also inspected the full demonstration list and scene at 820×1180. These are viewport checks, not physical-device touch acceptance.
- Confirmed Lesson 1's four-phase list while playing. Ending an arm demonstration now immediately updates its stopped status and re-enables Watch example; the actual student robot/program remains separate. Added a stop/restart regression check to each active arm lesson's first example.
- Local preview: http://127.0.0.1:4205/beginner-3axis/ . No push or deployment. Original app and all prior work preserved.

## Assessment clarity repair, Lessons 4–6 — 12 October 2026

- Explicit Predict → Operate → Explain stages replace the prediction hidden inside Operate. Each writing question directly labels its answer box. Blank predictions receive inline feedback and focus; saved predictions can be revisited without invalidating operational evidence. Explanation appears after practical evidence is complete, with a separate Save explanation button and saved/unsaved feedback.
- Practical scenes and their examples suppress floating Current TCP/Target labels. Current coordinates remain in a caption below the canvas; ghosts, paths, trails and feedback remain. Phone operation separates the scene from a scrolling control area, avoiding the former sticky-scene overlap.
- 89 Node tests pass. The complete seven-lesson DOM journey passes, including new assertions for prediction validation, stage transitions, saved-prediction revisiting and explanation saving. Optional tutor DOM tests pass for offline saving, mocked online dialogue, errors and export. No live Qwen test was performed.
- Browser interaction recovered in a fresh local tab. Completed Lesson 4 from prediction through approach/grip/lift, explanation and Next lesson. Tested Lesson 5 prediction, Reset, Record and successful recording of a move at 390×844. At 820×1180, confirmed the lesson-switch dialog, Lesson 6 prediction, pickup and actual blocked-route rejection with unchanged TCP. The full Lesson 5 replay and independent Lesson 6 task are covered by the DOM suite, not re-completed in the browser during this repair.
- Phone layout was checked while accessing lower controls and performing a move: the robot and Move controls remained in separate visible rows; document/client widths both measured 375 CSS px. Desktop 1280×900 and tablet 820×1180 were visually inspected. Physical-device touch and keyboard/IME testing remain outstanding.
- Lesson 7 was not redesigned. Original root files and prior work are preserved. Local preview remains http://127.0.0.1:4205/beginner-3axis/; no push or deployment in this repair.

## Focused Lessons 4–7 — 12 October 2026

- All lessons now keep each short concept alongside its isolated Three.js example. Lesson 4 has a focused approach/grip/lift station; Lesson 5 adds recording and replay controls; Lesson 6 adds blocked-route feedback and an independent destination-B reference table. Actual trails, ghost targets and expected paths remain available. Active replay targets are shown instead of the idle draft; reset clears the practical trail.
- Review separates actual test evidence from written reflection. Missing evidence provides a return-to-practice action. Lesson 7 uses four short proposal questions, locates missing fields without discarding answers, then offers reflection and portfolio JSON export. Offline completion and optional AI dialogue retain their existing evidence rules.
- New practical activities with an existing program use an in-app prompt explaining the reset, with Keep working, Save JSON and Start activity. This replaces the native browser confirmation. Cancel/confirm behavior is covered by the DOM journey; final live interaction with this prompt remains pending due to the browser-control limitation below.
- Final seven-lesson DOM journey passed, including the focused Use target/Move controls, grip, recording, actual obstacle rejection, independent B coordinates and replay, incomplete proposal feedback, final export availability, local reload and JSON/text export. 89 Node model/unit tests, tutor DOM mocks and six Python server tests also passed. No live Qwen connection was available locally.
- Real browser: completed Lesson 4 using the visible approach, pickup, grip, +10 mm lift, evidence review and reflection; continued into Lesson 5. Recorded the nine-action transfer, inspected Steps, exercised Pause/Resume/Stop/Reset, completed a full replay and saved reflection. WebGL rendered the connected robot and moving held part.
- Browser input subsequently stalled: mouse/keyboard actions stopped changing the app, although DOM reads, select changes and screenshots still worked. Fresh tabs and a session reset did not recover it. Thus full browser completion of Lessons 6–7 and responsive operation/scrolling acceptance remain outstanding. Automated completion is not claimed as browser acceptance. Phone 390×844 and tablet 820×1180 lesson-page layouts were inspected; phone document width and scroll width both measured 375 CSS px. Physical-device testing remains outstanding.
- Preview remains http://127.0.0.1:4205/beginner-3axis/ . Normal viewport restored. Original root app and prior work preserved. No GitHub push or deployment.

## Focused Lessons 1 and 3 — 12 October 2026

- Lessons 1–3 now use Vocabulary → Concept/example → Assessment. Explanations remain alongside their isolated Three.js examples. Robot-type navigation advances to the next type rather than a second page with the same robot.
- Lesson 1 assesses one illustrated job at a time, preserving selections across Previous/Next. Demo replay is an optional disclosure. Matching feedback identifies incorrect question numbers; the three-axis course focus still appears only after assessment completion.
- Lesson 3 provides a focused Z target and Move action, with X/Y held fixed, degree/mm readouts and explicit Inspect joint changes. Its second demo ends with a worked calculation drawn from the demo's committed movement. Practical assessment uses the learner's actual start/end heights and simulated duration, with a vertical height diagram, individual calculation feedback, reflection and a clear continuation message.
- Calculations remain usable offline. Optional Qwen requests receive the latest calculation and completed-movement measurements; live Qwen remains unverified locally.
- Legacy matching scores are re-evaluated only after the complete payload validates under the previous rules; responses/events are preserved. Forged statuses remain rejected.
- Browser: completed Lesson 3 including wrong calculation, correction, reflection, and Next lesson into Lesson 4. Completed all five Lesson 1 scenarios on a 390×844 viewport and saved the reflection. Inspected paired 3D examples at tablet width. These are browser viewport checks, not physical-device certification.
- Validation: 89 Node model/unit tests, the complete seven-lesson DOM journey, tutor dialogue mocks, and 6 Python server tests pass. Phone width check: document scroll width equals client width (375 CSS px with scrollbar). Desktop 1280×900, tablet 820×1180 and phone 390×844 inspected.
- Local preview: http://127.0.0.1:4205/beginner-3axis/ . No GitHub push or deployment in this update.

# Local integration verification — 12 October 2026

## Clear submission feedback and focused Lesson 2 — 12 October 2026

- Submit answers displays a saved score, green correct cards, amber review cards and bilingual offline hints. Edited selections are labelled unsubmitted until checked again. Duplicate robot choices and blanks retain their own job-card selections, including JSON storage. The latest submission determines matching completion, consistently with the visible score.
- A successful submission explicitly notifies the optional Qwen tutor. It receives the checked answers and score; unrelated glossary buttons cannot trigger a request. Offline hints are recorded as assistance. Mocked tests cover automatic answer feedback and a follow-up dialogue. Live Qwen remains unverified because the key is only on the school server.
- Lesson 2 has Vocabulary, Parts in motion and Assessment. Each concept retains its text beside an inline robot preview and Watch example; there is no concept/demo page jump. Only concept-relevant labels appear, connected to their parts with leader lines.
- Try a joint contains the prediction, a focused robot and J1 +/-10 degree actions. The ordinary XYZ/program panels are absent. Identify & explain uses the actual educational arm model with A-F callouts and one matching question at a time. Motor and controller geometry is explicitly illustrative.
- Saved reflections in matching lessons are no longer invalidated by later answer submission/correction. Actual joint operation is still required for Lesson 2. A specific, actionable continuation message explains missing work.
- Browser: completed the actual J1 activity, submitted an intentionally incomplete 3/6 response, inspected hints, saved a reflection, corrected answers and obtained 6/6 with Next lesson enabled. Checked the A-F diagram, question navigation and retained completion at 390x844; all six callouts visible and no horizontal overflow. Desktop concept/demo and assessment layouts were inspected in real WebGL.
- Model/unit suite: 88 passed. Seven-lesson DOM journey and mocked tutor dialogue suite passed. Six server tests passed. Physical touchscreen and live Qwen acceptance remain separate. Changes remain local; no GitHub push or school-server deployment.

## Optional AI dialogue, paired lessons and visual assessment — 12 October 2026

- All seven lessons now use short concept/demo pairs before assessment. The remaining six lessons have isolated, executable short demonstrations; demo coordinate/joint readouts follow the demonstration robot, not the unchanged learner robot.
- Lesson 1 uses five original illustrated job cards. Existing checks still evaluate the taught demo matches; written reasoning and alternative proposals remain for discussion and teacher review.
- Reflections save locally before optional AI requests. Without a connection, reflection and JSON export work with an honest offline message. When Qwen is configured, saving requests feedback automatically and follow-up dialogue is available. Failure/retry preserves work; changing lessons isolates old replies. Independent-task dialogue is deferred until the delivery test.
- **87 Node tests passed**, including short-demo execution, bounded assessment snapshots and network response validation. **Six Python tests passed** with mocked provider responses and static-file access checks. The dedicated tutor DOM checks passed for offline saves, automatic feedback, two-turn dialogue, JSON/text roundtrip, failure/retry, independent-task saving and stale-reply isolation.
- Browser preview: `http://127.0.0.1:4205/beginner-3axis/`, localhost only. Verified actual offline saving, visual selections, anatomy WebGL movement and demonstration readouts. Inspected desktop, phone 390×844 and tablet 820×1180. Phone reflection field-to-button gap is 12 px; no horizontal overflow at phone/tablet sizes. Improved short-unit headings for narrow screens. These are browser viewport tests, not physical-device touch certification.
- Qwen credentials are only on the school server. **No live Qwen request or pedagogical-quality evaluation was possible locally.** Server/mock tests establish integration behavior, not live answer accuracy. Review a misconception, correction dialogue, correct answer and failure on the school server in both languages before classroom acceptance.
- No database, production deployment, merge or push. Existing root app and earlier work preserved. Local preview server remains running for review.

## Paired robot-type lessons and assessment references — 12 October 2026

- Lesson 1 now runs Vocabulary, then each robot's Concept and Demo together, then Assessment. Continue, arrows, swipe and keyboard navigation share this order. Numbered robot buttons revisit the chosen concept. The selected robot survives page reload.
- Assessment explicitly refers to the five prior 3D demonstrations, supplies robot-specific replay links and asks learners to compare observed movement and body plans. Replay opens the selected example; both the return button and fixed footer return to assessment. In-progress answer selections remain intact. English and Chinese copy are supplied.
- Validation: 84 Node tests passed. The seven-lesson DOM journey passed, including all ten ordered concept/demo slides, back navigation, each assessment replay link, retained answers and footer return.
- Browser at localhost:4204: verified articulated concept/demo followed by gantry concept/demo, gantry reload restoration, SCARA replay from assessment and return. Checked the new replay controls and fixed return button at 390 × 844; no horizontal overflow. Normal viewport restored. Existing learner state on port 4203 was not changed.
- No push, merge or public deployment for this revision.

## Robot-type slides, Three.js examples and vocabulary — 12 October 2026

This supersedes the earlier 2D robot-type demos below. Concept now uses one
swipeable slide window; Demo uses a shared Three.js renderer showing five
different connected mechanisms doing jobs. Navigation supports horizontal
pointer swipes, previous/next arrows, numbered type buttons and keyboard arrows.
The three-axis articulated course-focus message is shown only after the type
assessment is complete. All lesson text can expose bold glossary terms with
bilingual, keyboard-accessible definitions; editable learner responses and
operation controls retain their original behaviour.

- **84 Node tests passed**, including sampled 3D arm/SCARA link lengths, all three
  delta-chain closures, rover motion, the closed gantry print path and continuity.
- **Seven-lesson DOM journey passed**, extended with slide navigation/swipe events,
  all five demo controls, glossary lookups in each lesson, preservation of learning
  and robot state on lookup, and completion-gated course focus. The model tests
  establish geometry; DOM fallback does not claim WebGL rendering.
- Inspected all five real WebGL previews in the in-app browser. Checked actual
  horizontal drag from gantry to SCARA at 390×844, playback/scrubbing, connected
  arm/SCARA/delta geometry, gantry print outline and rover parcel delivery.
- Checked desktop 1280×1000, tablet 768×1024 and phone 390×844. Phone document had
  no horizontal overflow, and the definition popup stayed within its width.
  English and Chinese definitions worked; Enter opened a term and Escape closed
  it. Fixed glossary markup so terms inside questions do not steal input labels.
- Completed the robot-type assessment through visible browser controls: matching,
  saved explanation, then the course-focus message and enabled Next lesson.
- Physical touch hardware and full screen-reader certification remain untested.
  Demos illustrate kinematics, not forces, payload or industrial accuracy. The
  learner robot/program and root application remain isolated and unchanged.

Local preview is still **http://127.0.0.1:4204/beginner-3axis/**. No deployment.

## Learn / Explore presentation revision — 12 October 2026

- Learn now follows Vocabulary → Concept → Demo → Assessment. Practical assessment
  has Operate and Explain & check substeps. Reading and written assessment omit
  the 3D workspace; relevant arm demos and practical operation show it again.
- The types lesson has five playable/scrubbable 2D mechanism models, replacing
  its static diagrams. Captions distinguish simplified views and non-modelled
  physical behaviour. Explore keeps the actual three-axis arm and existing tools.
- **84 Node tests passed**, including sampled fixed-link geometry, connected delta
  chains, differential-drive motion and continuous phase transitions.
- **Seven-lesson DOM journey passed**, extended to all five mechanism play/pause,
  reset/scrub controls, pausing on phase exit, four-stage navigation, conditional
  scene visibility and protection of learner scene/program state during demos.
- In-app browser: tested robot-type playback, pause and scrubbing; switching Learn
  to Explore; anatomy's real 3D joint demo and practical assessment; English and
  Chinese; desktop 1280×720/960, phone 390×844, tablet 768×1024. Phone document had
  no horizontal overflow. Demo controls and mechanism could be viewed together
  after scrolling. Fixed inherited mobile rules that hid the lesson selector and
  title on written assessment. Physical touch-device acceptance remains pending.
- Browser automation stalled on the pre-existing native confirmation when changing
  lessons with a nonempty test program. Closed that agent-owned tab, reopened the
  preview and used the app's explicit Clear program dialog for the previously
  exported test program; then verified the anatomy transition. Native-confirmation
  automation is not counted as a passed browser check.
- Preview remains **http://127.0.0.1:4204/beginner-3axis/**, localhost only. No
  root-app edits, main merge or public deployment were made.

## Latest learner-brief revision — 12 October 2026

This section supersedes the older UI/learning limitations below where explicitly
verified. Work remains isolated to `beginner-3axis` on
`feat/three-axis-learning-lab`; no root app changes or public deployment.

Local preview: **http://127.0.0.1:4204/beginner-3axis/**, bound to localhost and
left running. The existing port-4203 server was not stopped.

### Regression results

- **80 Node tests passed**, zero failures. Includes all supplied model tests plus
  bilingual lesson structure, seven real-model demonstrations, connecting gripper
  bridge geometry, actual-motion calculations, validated file restore, nonmutating
  ghost/path previews and separation of example/learner trails.
- **Seven-lesson DOM journey passed**, including obstacle rejection, independent
  destination-B recording and replay, preservation of a completed program when
  entering design reflection, export actions and restored prediction fields.
- `git diff --check` passed. No tracked root application file changed.

### Browser learner checks

Performed using visible controls in the in-app browser, without injecting learner
state or marking completion through private APIs:

- Robot-type diagrams and matching; anatomy joint operation and part matching.
- Coordinate prediction, actual +10 mm Z movement, joint-change inspection,
  displacement/distance/speed calculation and reflection.
- Approach, actual grasp and 10 mm object lift; no success on preview alone.
- Nine-action manual program recording, reset/replay, pause/resume, stop/reset;
  paused pose stayed unchanged while toggling the trail.
- Saved position selection shows a ghost and planned route without moving the
  robot; actual replay produces an orange trail. Record OFF prevents program bloat.
- Direct carrying route rejected with actual pose unchanged; red target preview
  and contextual scripted guidance; completed the clearance detour.
- Independently typed the **rounded coordinates shown in the interface**, recorded
  nine actions for destination B, reset/replayed and obtained the changed-target
  pass with no hints. Reflection had to be saved after replay completion.
- Interest/design proposal and reflection; changing to design retained the tested
  program and scene. Reloaded fields show the saved writing and answers.
- Downloaded project JSON, reopened it through the file picker, and confirmed it
  replaced a deliberately edited test learner-name field and retained the nine-step
  program, actual scene and learning evidence. Downloaded PNG scene image after
  changing the image download to a Blob URL for browser compatibility.
- No errors/warnings in the final browser console check.

Responsive interactions checked at 1365×900 desktop, 768×1024 tablet, 390×844
phone, 844×390 landscape and 320×568 narrow phone (including Chinese and an actual
Move). Landscape initially cut off the scene after rotation; fixed by constraining
the workspace and scrolling the inspector. Portrait keeps the scene/readout sticky
while the controls scroll. No horizontal overflow in the checked narrow view.

Screenshots in the parent project's `test-artifacts/`:
`three-axis-learning-desktop.png` and `three-axis-learning-phone.png`.

### Honest boundaries

- These are browser viewport checks, **not physical phone/tablet or touchscreen
  acceptance**. Full keyboard/screen-reader traversal and 200% text zoom remain
  to be evaluated with learners and teachers.
- The guide is state-aware scripted guidance, **not a live AI teaching agent**.
  No external AI service, API key or student database was introduced.
- Collision/kinematics/grasp rules are simulated. Gravity, friction, payload,
  impact and electrical behaviour are explained only. Decorative covers are not
  calibrated industrial contact meshes.
- Automatic checks establish actions/results and checked calculations, not the
  quality of open-ended reasoning. A teacher must review the portfolio.
- A feature branch/local preview is not a public website deployment. The existing
  main app and GitHub Pages site remain unchanged by this revision.

Imported the supplied two-commit patch on `feat/three-axis-learning-lab` from
`25a1cd43c393ad16fa570529efe4ee97daf62035`. The imported tree matched
`a98920a684c20138bd3364e79ac7baae276821a2` before this verification note and the
module-only `.gitattributes` addition. No root application files were changed.

## Automated checks rerun here

- Node v24.19.0: `node --test beginner-3axis/tests/*.test.mjs` — 73 passed, 0 failed.
- `npm ci --ignore-scripts --no-audit --no-fund` installed the locked development dependencies.
- `npm run test:dom` — all supplied DOM checks passed: seven lessons, obstacle
  rejection, independent destination-B recorded replay, exports, reload/reset,
  preview/commit, nine-step recording/replay, pause/resume, stop/reset, editing,
  invalid input and language preservation.
- All nine original Git blobs match `baseline.sha256`; eight working files also
  match byte-for-byte. The existing Windows checkout of `workspace.css` uses
  CRLF, unlike its LF Git blob. It was left untouched; Git reports no root diff.
- The first run found a vendor checksum failure because `core.autocrlf=true`
  converted the patch checkout to CRLF. Restored the supplied vendor bytes and
  added `.gitattributes` inside this module only to preserve LF. No vendor logic
  or checksums were changed. The rerun passed all 73 tests.

## Real browser checks

Local server: `http://127.0.0.1:4203/beginner-3axis/`, explicitly bound to
`127.0.0.1` only. The preview server was left running for review.

Verified in the Codex in-app browser:

- WebGL robot renders, with three joints and visible fixture/axis labels.
- Recorded two completed movements: +10 mm Z, then Y=70 mm.
- Reset restores the program start and retains two steps.
- Playback completes at the recorded endpoint without adding steps.
- Pause holds the displayed pose stable across subsequent checks; Resume works.
- Stop interrupts playback at a partial pose; Reset then restores the start.
- Gripper closes and opens; recording OFF does not add steps.
- No console errors or warnings during these checks.
- A phone-width layout spot check was performed; this is not full responsive acceptance.

## Remaining review items

- Several scene labels overlap in the default camera view.
- Target inputs show long decimal values, which could distract beginners.
- Complete keyboard-only lesson traversal, focus trapping/restoration, 200% text
  zoom, the full requested viewport matrix, physical touch devices and all seven
  lessons in a real browser remain unverified. The seven-lesson DOM pass is not
  a substitute for those checks.
- The original root app was protected by Git/hash checks, not a new full manual
  regression run.
- The supplied module saves under its own localStorage key and exports JSON/text;
  it has no import UI. This behavior was retained from the supplied module.

Publication is a feature-branch push only. No main merge, root navigation change
or public website deployment is authorized by this integration.

## UI refinement — 12 October 2026

Reworked the isolated module into a compact white/slate instrument workspace with
blue actions, a clear current/target distinction, one-decimal coordinate display,
expandable reference/coach/portfolio sections, and a native program editor.
The original six-axis app remains untouched. The header uses Robot Lab and keeps
Christopher Hansen attribution. No backend or new runtime dependencies were added.

The robot now has tapered silver arm covers, cylindrical base housing, blue joint
covers and fastener details. These covers are visual decorations, not additional
joints or calibrated contact geometry. Kinematics, swept collision proxies,
gripper logic, lesson assessment and saved model data are unchanged.

Framing now uses occupied scene points. Inactive fixture labels and coincident
target labels are hidden, and visible labels are separated in screen space.
Anatomy numbers remain available through About this model. On portrait phones,
the scene stays visible above the scrolling controls; short screens use normal
flow so the pinned view cannot consume the entire display.

Verification: all 73 Node tests passed again; the seven-lesson DOM journey passed
again. Real-browser movement, Chinese learning layout, tablet program dialog,
and portrait scene/control visibility were inspected. No horizontal document
overflow was found at 390px and 768px widths. Full accessibility certification,
physical touch-device acceptance and a complete viewport matrix remain pending.

CAD-style follow-up: joined scene and inspector into one instrument shell,
relocated actual TCP coordinates into a small scene HUD, grouped Move/Open/Close,
and arranged mobile XYZ controls into three columns. Added a robot-arm silhouette
header icon. The final seven-lesson DOM journey passed again; phone-width editing
kept the scene visible and showed no horizontal document overflow.

## Delta mechanism and packing example — 12 October 2026

Replaced the old stick-frame Delta illustration with an isolated industrial-style
model (`delta-model.mjs`): rear portal and cantilever, triangular drive housing,
three motor casings, tapered upper links with connected elbow crossbars, six
paired lower rods, ball joints, a level triangular moving platform, vacuum cup,
flexible illustrative supply hose, infeed conveyor and receiving tray. This is
an unbranded educational mechanism, not a manufacturer's calibrated CAD model.

The motion uses fixed-length inverse kinematics for all three chains. The upper
links stay below the drive housing throughout this example. The packet is contacted
before suction turns on; it lifts vertically, travels above the tray, lowers
vertically, releases while supported, and remains in the tray as the empty tool
withdraws and returns. Short English/Chinese captions follow actual pose state.
Forces, payload limits, pneumatics and cable dynamics are not simulated.

Verification: 93/93 Node tests pass. New checks sample 2,001 linkage poses and
4,001 packet poses for fixed lengths, parallel-rod spacing, IK continuity, usable
upper-arm angles, vertical entry/exit, tray clearance, contact before attachment,
continuous packet motion and release at the destination. This is geometric
verification of this example, not general industrial collision certification.
Browser checked at 1280×900 and 390×844: contact, held transfer, release and empty
return, replay, pause, reset and scrubbing. All four example steps and the entire
robot remain visible at phone size; no console errors were recorded. Touch hardware
has not been physically tested. Original app and learner robot state are unchanged.

Reference mechanisms reviewed: ABB IRB 360
(https://www.abb.com/global/en/areas/robotics/products/robots/delta-robots/irb-360)
and FANUC DR series (https://www.fanucamerica.com/products/series/dr).
The demonstrator is deliberately three-axis, with a separate suction action.
Local preview: http://127.0.0.1:4205/beginner-3axis/ . No GitHub push or deployment
was performed for this revision.

## Explore exercise workspace — 12 October 2026

Added three selectable exercises with current operation status and verified
completion checkmarks. Removed tool/fixture text overlays from Explore's canvas;
coordinates remain in dedicated strips. Reset & test preflights the recorded
program before restoring its start, disables recording, and then replays it.
During replay, the target ghost follows the active step instead of the stale
starting target. Lesson Run/Reset behavior is unchanged.

Verification: 96/96 Node tests passed, the seven-lesson DOM journey passed, and
the new three-exercise DOM journey passed. Tests cover recording, all three task
goals, replay, pause/resume, stop/restart, invalid-program preservation, task
switch confirmation, bilingual labels, JSON result roundtrip and rejection of
tampered completion evidence.

Real browser checks at 390×844, 768×1024 and 1280×900 covered layout and visible
controls. Recorded and completed the two-move task at phone width, replayed it,
reloaded its result, switched to Pick & place, and used a reference target to
preview without moving. No horizontal overflow at phone width or console errors
were observed. The full pickup/obstacle journeys were checked in the DOM harness;
physical touchscreen testing remains outstanding. Preview server remains on
127.0.0.1:4205. This exercise revision has not been pushed or deployed.

## Exploration-first entry and actionable guidance — 14 October 2026

Default entry is free Explore with recording off and a visible Start lessons action.
Saved project/task state is retained. Guided practice derives its green next-action
highlight from actual reset, recording, target, action and replay evidence. Examples
use an isolated controller and demonstrate the same target/Move and recording
workflow as practice. Preview feedback updates after corrections; invalid program
steps have translated explanations.

Verification: 98/98 Node tests passed, including the next-action progression and
actual isolated demo recording/reset/replay. Seven-lesson DOM and three-exercise
DOM journeys passed. Browser checks at phone width (390 by 844) verified demo
control output, Reset → Record → target → Move highlighting, movement/recording,
and return to Explore with the saved step retained. Fresh entry, Z-plus movement,
invalid-target rejection and corrected feedback were also checked in-browser.
Physical touch and assistive-technology acceptance are still outstanding.

Local preview: http://127.0.0.1:4206/beginner-3axis/ . Server is localhost-only.
This revision has not been pushed or deployed to GitHub.

### Self-learning introductions — 14 October 2026

Added separate in-flow welcome and Learn guides, initially expanded and always
reopenable. They explain the first control action, preview versus movement,
recording, course order, glossary, navigation and JSON export. Acknowledgement
only stores an orientation preference; it does not award lesson completion.

98 Node tests passed. The focused starting-guide DOM check passed for independent
first visits, dismissal persistence, Chinese text, focus handoff and blocked
storage. Browser checks covered opening both guides, dismissing, reopening,
reload persistence and reaching Z-plus controls at 390×844, plus desktop layout
at 1280×900. No real touchscreen or screen-reader acceptance claim. No deployment.

### Welcome simplified — 14 October 2026

Supersedes the two introductions above: one first-visit language selection and
brief feature overview, dismissed by Start exploring. No Learn introduction.
Focused DOM checks passed for language synchronization, mode visibility, dismissal
persistence and blocked storage. No deployment.

## Feature-branch release validation — 15 October 2026

The exploration-first workspace, exercise replay/progress, actionable lesson
guidance and brief bilingual welcome are included in this release. Earlier
not-pushed statements above describe their review-stage status. The original
root app remains unchanged; publishing this feature branch does not deploy Pages.

Pre-commit checks: 98/98 Node tests, welcome DOM checks and all three Explore
exercise DOM journeys passed.
The complete seven-lesson DOM journey and reload/reset integration checks also passed.

## 2026-10-15 — grasp repair and unified movement controls

Reproduced Challenge 3 in the browser: from home, move to X147 / Y−84.9 / Z130, lower to Z80, Close. The original version rejected this physically valid contact with GRASP_APPROACH_REQUIRED, despite instructing the learner to approach from above. That hidden history check also affected Pick & place. Grasp now uses current position, alignment, opening, and checked jaw clearance. Collision and unsupported-release checks remain active; objects do not teleport.

Added XYZ, Joints and incremental Jog controls to exploration and practical lessons. Joint actions record and replay their actual joint motion. Their expected path curves with the joint, and the program preview uses sampled plans. Moved Test program/Pause/Stop next to Record. Removed the three dropdowns; Save / load in the header retains JSON, text, image and learning-evidence export.

Verification: 103 Node tests passed, plus the seven-lesson DOM journey, extended Explore DOM journey, and welcome DOM test. Regressions cover rounded displayed pickup coordinates, incremental vertical approaches, both delivery tasks, blocked routes, recording/joint/jog playback, pause/stop/reset, invalid imported joint commands, and joint preview geometry. Browser: completed all three tasks through visible controls; tested Challenge 3 pause/resume, pickup and release; confirmed stop/reset preserve recorded steps. Tested movement modes and scrolling at 390×844, waypoint/pick-and-place at 820×1180, and desktop at 1280×720. These are browser viewport checks, not physical-device touch certification. No new errors on the final localhost server.

Local review: http://127.0.0.1:4209/beginner-3axis/ (localhost-only, no-cache server). The original root simulator is unchanged.
