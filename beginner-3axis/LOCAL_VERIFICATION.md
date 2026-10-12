# Local integration verification — 12 October 2026

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
