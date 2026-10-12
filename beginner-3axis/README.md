# BNTA Robotics · Three-axis learning lab

An isolated beginner entry for **Robot Lab, developed by Christopher Hansen**. The original six-axis simulator and all nine original repository files are unchanged. Open `beginner-3axis/` directly; this branch does not add a root-page link or deploy a site.

**Review build: automated model/controller/lesson and DOM integration checks pass. Real-browser visual, responsive, keyboard and touch acceptance remains outstanding.** See [BUILD_PROGRESS.md](BUILD_PROGRESS.md).

## Run locally

From the repository root:

```sh
python -m http.server 8000
```

Open `http://localhost:8000/beginner-3axis/` in a current WebGL2-capable browser. To test a GitHub Pages-style project subpath, serve the parent of the repository and open `/bnta-robotics/beginner-3axis/` (or the actual checkout folder name). Assets and module imports are relative. Do not open `index.html` through `file://`.

No application build, backend, account, runtime package installation or network API is required. Three.js is pinned and served locally. With WebGL2 unavailable, the page explicitly reports the limitation and keeps text coordinates and controls available; this is not a working 3D view.

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
```

The DOM harness exercises the actual page event handlers and controller, including the seven-lesson journey. **jsdom does not test pixels, layout, WebGL, real keyboard focus trapping, touch, or physical devices.** The normal unit suite does not need jsdom or npm installation. A test-only `BNTA_JSDOM_PATH` override can point to an already-installed jsdom module.

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

Wireframe markers are abstract support/capture fixtures. Pickup requires the actual part centre within 2 mm, forward-axis alignment within 10°, compatible opening and a verified final approach of at least 20 mm in a 2 mm corridor. Approach provenance is part of scene snapshots; it is rechecked and consumed on grasp. A held part preserves its actual local transform and tilts with the tool. No snapping occurs. Opening while held is accepted only at a known compatible fixture; free dropping is intentionally not simulated.

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

Seven short lessons introduce body plans, anatomy, joint-vs-XYZ movement, actual grasping, recording/replay, obstacle planning and an interest-led design proposal. Body-plan definitions, example jobs, trade-offs, morphology/cobot distinctions, sensor caveats and a post-replay six-axis comparison are visible teaching content. Answer checks and actual controller events supply evidence; predictions and learner-authored reflections remain separate. The scripted coach does not grade open-ended reasoning or operate the robot.

The changed-target attempt uses destination B, a new/edited recorded program and actual replay release evidence. Hints and worked examples are tracked; the independent attempt hides them and clears prior coaching. Fixture goal coordinates remain available as task information.

English and 简体中文 use paired offline dictionaries, including the lesson framework. Learner-written names and reflections are preserved as authored. Significant errors/completions use a polite status region. The app uses semantic controls, confirmation dialogs, focus styling, reduced-motion support and responsive CSS. See LOCAL_VERIFICATION.md for measured browser checks; physical-device and full assistive-technology acceptance remain separate.

Only the new local key `bnta3axis:v1` is used as a convenience copy. The old application's data is never read, migrated or cleared. Recording never restores ON. Bad/stale stored data is retained and blocks overwrite; quota/privacy failures keep the current session usable and visibly request an export. Save project JSON includes a validated resume payload, and Open project JSON validates before confirming replacement of current work. No server database is used.

Evidence history is capped at 2,000 events: the app warns and stops adding evidence rather than silently deleting it. Text fields are length-limited. Names are optional and blank by default. JSON and readable text exports include actual events, predictions, calculations, reflections and limitations. Save scene image creates a separate PNG; retain it with the project. No analytics, AI calls, student-data upload, API keys or hardware connection is present. The guide is honestly labelled scripted. `coach.mjs` exposes a bounded future-adapter schema only.

## Brief revision and reusable teaching framework

Read [BRIEF_REVIEW.md](BRIEF_REVIEW.md) for the pre-change learner audit and [TEACHING_FRAMEWORK.md](TEACHING_FRAMEWORK.md) for lesson outcomes, evidence and teacher review. Each lesson has Understand, Watch, Try and Review phases. Examples use an isolated controller and never contribute student completion evidence. A new anatomy attempt requires actual joint operation; a new coordinate attempt also requires a calculation checked against the actual movement and model time. Earlier stored attempts remain compatible.

Ghost shows the target arm pose. A dashed blue line shows expected TCP travel; the program panel shows the whole saved route. Red indicates an invalid move/program, not simulated impact. The orange trail follows actual movement and can be hidden or cleared. These overlays do not move the robot or change a program. The gripper now has a connecting slide bridge included in collision checks.

## Dependencies and attribution

Runtime renderer: official **three@0.180.0**, MIT, from `https://registry.npmjs.org/three/-/three-0.180.0.tgz`. Copied unmodified:

- `vendor/three/build/three.module.js`
- `vendor/three/build/three.core.js`
- `vendor/three/examples/jsm/controls/OrbitControls.js`
- `vendor/three/LICENSE`

Registry SHA-512 integrity, tarball SHA-512 and individual SHA-256 hashes are recorded in [vendor/three/PROVENANCE.json](vendor/three/PROVENANCE.json) and tested. The browser import map binds `three` locally; the original minified root bundle is never imported. jsdom@26.1.0 is pinned in package-lock.json for development-only DOM checks.

Robot Lab — developed by Christopher Hansen. Original MIT copyright/permission and Three.js/cannon-es notices remain at the repository root unchanged. This additive educational variant retains that attribution. No FAIRINO affiliation or physical hardware certification is claimed.
