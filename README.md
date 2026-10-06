# Robot Lab — Christopher Hansen

**Developed by Christopher Hansen.**

A bilingual robotics learning environment that helps students gain confidence with robot control, build a movement program, and test a waypoint route before solving a practical loading problem. Designed around lower-secondary learners, including Grade 7 students, as preparation for work with physical robots.

[Open Robot Lab](https://zhinii.github.io/bnta-robotics/) · [GitHub repository](https://github.com/zhinii/bnta-robotics) · [MIT license](LICENSE)

The public edition uses a neutral whitebox interface, a gray 3D environment, and compact author attribution in the footer. Blue marks selected controls and pose previews; a thick green outline marks the current lesson action. Orange shows actual movement and red flags blocked movement. Box colors and letter labels connect the placement plan to the scene.

## Introductory learning sequence

**Robotics 101 → Interface → Practice → TCP waypoints → Box pickup task → Quiz.** English and 简体中文 are available throughout. The first opening asks for language. Learn, Control, Program and Challenge provide the main navigation. Students can revisit lessons; completion adds a checkmark. The waypoint program must succeed before the pickup and stacking challenges unlock. Explore remains available for independent experimentation.

| Stage | What students do | Evidence of understanding |
| --- | --- | --- |
| Robotics 101 | Five short interactive sections: useful robotic tasks; links, joints, motors and gripper; position versus orientation; feedback, gravity and limits. Students try two joints, identify parts, manipulate height/orientation, compare empty closure with a real grasp, and predict/test an unsupported release in an isolated model. | Explain an actuator versus a sensor, compare shoulder/wrist movement, and identify a useful task plus a limitation. |
| Interface | Six verified actions in a temporary workspace: camera, a reached XYZ move, DO1/DI1, saved positions, selecting a ghost, and running a prepared sequence. Closing restores the student session. | Distinguish moving now from recording for later; locate feedback and export progress. |
| Practice | Watch an optional, repeatable one-box simulation, then build and run the transfer using contextual guidance. | Approach, grip with DI1 feedback, lift, transfer, lower, release and retreat in the right sequence. |
| TCP waypoints | Move the TCP to P1 → P2 → P3, using intermediate poses to avoid two 135 mm obstacles. Record the route and Run from reset; each saved checkpoint allows 8 mm position tolerance. | Reach all three targets in order through a collision-free program; then unlock pickup. |
| Task | Independently transfer assigned boxes A → B → C; write a brief approach, test the recorded program and reflect on a revision. | A working sequence, position accuracy, a height calculation and an explanation based on feedback. |
| Quiz | Eight questions covering robotics, feedback, control and the maths used in the activity. Explanations and unlimited retries are provided. | First checked answers and corrections are saved separately; completing the simulator is not physical-robot operating certification. |

The lessons use the supplied Grade 7 readiness: arithmetic, units, angles, rectangular area and simple coordinates. The worked pickup is Z 20 mm; on a 20 mm bed a 20 mm box has its top at Z 40 mm. A lift from Z 20 to 110 changes height by 90 mm. A 60 × 40 mm base has area 2,400 mm², unchanged by rotation. Total area as a percentage of the bed is an optional extension. No trigonometry, Pythagoras, function graphs or quantitative mechanics is required. Gravity/support are introduced through observation; optics and heat are not prerequisites.

Teaching emphasis: identify a useful problem, predict, act, inspect feedback and revise. Timing and placement are simulation feedback; they do not establish learning on their own. Review the student's program, reasoning and final quiz together. Assigned destinations make this an introductory execution task, not an assessment of independent packing optimisation. Readiness and teaching time should be checked with the class; no unprovided departmental standard or research efficacy claim is asserted.

Practice starts with a recorded Open command, requires a Check grip instruction after Close, and checks the bed-plus-box height calculation before placement. Guidance becomes less specific after the initial approach. Task completion requires a full successful Run from reset, assigned placement within 5 mm / 5°, and a clear final retreat. Manual delivery alone does not earn completion.

Progress JSON version 5 stores the new practice and quiz evidence. Versions 2–4 and old program-only files still import; the first four unchanged quiz answers are retained where available, while revised questions need fresh answers.

Practice demonstrations preserve the student's program and robot state. Switching activities keeps their separate work in the current tab. Export JSON before ending a session. Run resets the scene before executing the program; Reset keeps the program. Task completion lets the truck depart after the empty gripper is clear, and provides an explicit Continue to quiz action.

## Gravity and handling

Opening the gripper at an unsafe height or unsupported placement now releases the box. A fixed-step rigid-body model simulates gravity, low rebound, friction, tipping and contact with other cargo, the floor, bed, shelf/obstacle solids and a simplified stationary robot. A box can balance with an overhang when its centre of mass is still above its support; the loading task still requires its full footprint to fit.

Incidents replay at **0.35× speed**, explicitly labeled. Robot controls and progress export wait for the replay to finish; replay time is excluded from the challenge timer. **Gravity & handling** opens with the modeled net fall, peak impact speed and recovery explanation. Red outlines mark affected cargo. High releases do not earn placement credit; displaced cargo loses its credit and must be recovered. Reset scene keeps the program. Export/import preserves settled positions and the release review; existing progress files remain supported.

Supported placements retain the existing small training tolerance. Friction and rebound are illustrative package properties, not calibrated material or damage predictions. Robot paths retain conservative collision guards; successful simulation does not establish that a physical robot operation is safe. If a release fails to converge to rest, the UI requests a scene reset before continuing.

Cargo physics uses [cannon-es](https://github.com/pmndrs/cannon-es), with its [MIT notice](CANNON-LICENSE.txt) distributed alongside the application.

## See the movement

- **Orange trail:** where the tool has actually travelled.
- **Dashed blue path:** expected tool-centre movement when you set a coordinate target.
- **Red marker and translucent robot/gripper/load:** the first predicted blockage. Any red continuation is unchecked.
- **Preview program path:** checks the saved sequence from the reset state, including grip/release commands, without moving the live robot or boxes. It stops at the first failure, matching the execution checks.

Trail and path visibility can be toggled. Joint sliders and XYZ/jog controls offer different ways to explore movement. The shoulder has a dedicated mounting bracket above the base; this visual refinement does not change the joint axes or link lengths.

## Choose orientation and movement

- **Keep current:** the default when switching from joints to coordinates; preserves current roll and pitch. Rz remains an explicit editable target.
- **Allow rotation:** position-only solving; the robot may rotate the gripper to reach the target. Rz input is disabled. Inspect the ghost tool before moving.
- **Point downward:** an optional pickup aid. Practice uses this pickup orientation.
- **Direct tool movement:** follows the requested tool path in small Cartesian segments. Placement assistance may add a final alignment.
- **Joint movement to target:** solves the destination pose, then turns the joints together. The tool can follow a curved path.

Collision checks and joint limits remain active for every choice. Feedback distinguishes a constrained-orientation failure from a solver failure and detected collisions. Position, orientation, path and successful grip are separate conditions.

Recorded moves retain their path and orientation settings; the step editor exposes both. New progress exports use version 4 for the eight-question final quiz. Existing version 2/3 project files and legacy cargo programs remain importable with their original downward/direct settings. Older app versions may reject new exports rather than silently lose these settings. Older three-question answers are retained, but do not count as completion of the expanded final quiz.

Stacking includes synchronized plan/front/side diagrams and a scale standing person within the existing finite collision volume (80 × 32 × 85 mm). The diagram's Z = 0 is the bed surface. This is a simulated obstacle, not a human safety separation model.

## Save student progress

The full-width 3D canvas is the workspace. Movement and Capture are compact overlay cards; portrait devices place them near the bottom and frame the robot above them. Choose XYZ, joint sliders or jog from the compact movement selector. XYZ has a small Move button beside it; joints and jog move immediately. Click DO1 beside the selector to toggle OFF (Open) / ON (Close). DI1 is a separate read-only held-object indicator. Collapse movement for a larger view. View settings and workspace utilities stay in small menus.

**Capture** adds a position or a gripper/check command without showing the entire sequence. **Review** hides movement controls and shows the program. Selecting a saved position displays its blue ghost without moving the robot. Use **Adjust position** to show controls, move the arm, and replace that saved pose. Selected steps can also be renamed, reordered or deleted. **Step** executes one instruction at a time and opens movement controls; **Run** executes from reset. Manual movement or program edits restart the next single-step run from the beginning. On very small or short screens, cards scroll internally while the scene remains visible.

Use **Export progress** to download a JSON file containing the current task, robot and objects, program, placement plan, learning progress, explanation, timing and assessment state. **Import progress** restores a stopped session. Resume a saved timed attempt explicitly; time away from the saved session is excluded.

Keep exported files when switching devices or ending a lesson. This static site does not upload student progress to a server.

## Hosting

This repository contains the prepared static website. GitHub Pages publishes the `main` branch at its root. Keep `index.html`, `app.js`, `style.css`, `LICENSE`, `THREE-LICENSE.txt` and `CANNON-LICENSE.txt` together when hosting a copy.

No account, API key or backend is needed. Teaching guidance is authored into the application; **live AI chat is not enabled in this edition**. Never put an API key in a public website or repository.

## Simulation limits

This is an educational model, not a real robot safety system or an exact industrial digital twin. It uses sampled motion checks and conservative collision bounds for the gripper, held cargo, task surfaces and obstacles. Cargo uses simplified rigid-body gravity and contact physics, with illustrative friction and rebound. It does not model all robot forces or arm/base/self-collisions. Placement assistance is intentionally forgiving. A clear preview means no blockage was found by these simulation checks; it is not a hardware safety guarantee.

The curriculum release passed 134 automated controller, save-file, kinematics and physics checks. Real-browser checks covered the full Robotics 101 and Interface flows on desktop and phone, Chinese phone/tablet robot visibility, practice playback, quiz corrections and JSON export/import. Browser checks verified optional simulation playback, returning to the student’s unchanged work after completion or early close, desktop/mobile layout, and the absence of playback panels during the optional simulation.

## Credit and license

**Copyright (c) 2026 Christopher Hansen.**

Original project software and documentation are available under the [MIT License](LICENSE). Keep the copyright notice and complete MIT permission notice in copies or substantial portions of the software. MIT permits use, modification and redistribution, including commercial use.

**Sharing or adapting Robot Lab? Credit Christopher Hansen.** Link back to this repository so others can find the original project. Suggested credit: “Robot Lab — developed by Christopher Hansen.”

Visible project credit is requested; it adds no restriction to the MIT license. Copies must retain the copyright and permission notices in [LICENSE](LICENSE).

**署名与许可：** 本项目由 Christopher Hansen 开发。分享或改编时，请注明 Christopher Hansen 并链接到本项目。可见署名是项目致谢请求，并非 MIT 的额外限制；复制或分发软件时仍须保留版权与许可声明。

- Three.js retains its own copyright and MIT notice in [THREE-LICENSE.txt](THREE-LICENSE.txt).
- The arm appearance is FAIRINO-inspired; no endorsement or affiliation with FAIRINO Robotics is claimed.


## Program editing and contextual help

Capture appends a position or command without showing the full sequence. Review shows two columns: a compact list (Pos 1, Pos 2, and command names), and details for the selected instruction. Coordinates appear only after selection, together with edit, move up/down and delete. Selecting a position shows its ghost without executing it. Undo restores program edits. Run and single-step playback retain collision checks.

The task reminder stays visible, while full lesson stages collapse. Failed playback instructions retain their number and explanation. The read-only position reference shows the held box’s assigned destination below the tool coordinates. A teaching demonstration restores the learner’s task state; the separate anatomy scene never changes it. Reduced-motion preferences disable automatic anatomy animation; replay and the joint slider remain available.


## Three-box exercises and pickup targets

New tasks use A, B and C. The introductory guided transfer still teaches one box before the independent three-box task. Stacking requires all three boxes to be placed across two levels, with at least one fully supported upper box. Existing six-box progress files retain their original inventory and stacking requirement rather than silently losing cargo.

Pickup targets advance automatically from A to B to C. Their readout gives dimensions, top-centre XYZ and Rz in world coordinates; these are tool pickup coordinates, not the box centre of mass. There is no target selector or automatic pickup movement. Orientation and path controls remain in the collapsed Settings section. Use the view cube to change the camera. Trail and Path toggles remain visible beside it.
