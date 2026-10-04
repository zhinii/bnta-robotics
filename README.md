# Robot Lab — Christopher Hansen

**Developed by Christopher Hansen.**

A bilingual robotics learning environment that helps students gain confidence with robot control, build a movement program, and test a solution to a practical loading problem. Designed around lower-secondary learners, including Grade 7 students, as preparation for work with physical robots.

[Open Robot Lab](https://zhinii.github.io/bnta-robotics/) · [GitHub repository](https://github.com/zhinii/bnta-robotics) · [MIT license](LICENSE)

The public edition uses a neutral whitebox interface, a gray 3D environment, and compact author attribution in the footer. Blue marks selected controls and guided highlights; orange shows actual movement and red flags blocked movement. Box colors and letter labels connect the placement plan to the scene.

## Learn, plan, program

On first opening, choose English or 简体中文, then enter the Explore workspace directly. Returning visits remember the language. There is no startup task selector or next-activity popup. The activity chain gives direct access to Introduction, Controls, Practice, Quiz, Challenge 1: Load, Challenge 2: Stack and Explore. All activities are available; completed activities turn green with a checkmark, while unfinished activities remain gray and selectable.

- Introduction uses an isolated animated model to explain J1–J6 and the gripper. Its canvas and camera refit to the selected joint’s motion when resized. Controls introduces the camera and interface separately.
- Practice helps students build and run a one-box transfer program. **Watch simulation** is optional and repeatable: it shows the complete transfer without a playback panel or action highlights. Closing it or letting it finish restores the student's program, robot pose and practice progress.
- Practice guidance is a compact helper with a bright blue border and pale-gold background. It floats over Program while using robot controls, and over Controls while recording or running instructions. It starts collapsed and can be opened or moved within that panel, without taking extra layout space.
- The introductory challenges use three boxes in assigned A → B → C pickup order and assigned destinations. Challenge 1 loads the bed; Challenge 2 adds stacking and an obstacle. World XYZ coordinates use whole-millimetre controls and readouts, while internal kinematics retain precision.
- Move the robot, record positions, then add Open, Close and Check grip commands. Recording a command does not operate the robot. Collision checks and joint limits remain active; placements allow a small 5 mm / 5° training tolerance.
- Successful loading is followed by truck departure once the empty gripper is lifted clear. Results include elapsed time and placement accuracy. These are simulation feedback, not proof of learning.
- Explore provides a separate three-box workspace without a lesson gate, quiz, timer or score.

Switching activities preserves their separate programs and task states in the current browser tab. Export progress before closing the page; JSON includes the active task and saved activity sessions. Import restores a stopped robot. Reset keeps the program; Run resets the scene before execution. Student placement planning is reserved for future lessons rather than required in these introductory tasks.

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

Recorded moves retain their path and orientation settings; the step editor exposes both. New progress exports use version 3. Existing version 2 project files and legacy cargo programs remain importable with their original downward/direct settings. Older app versions may reject new exports rather than silently lose these settings.

Stacking includes synchronized plan/front/side diagrams and a scale standing person within the existing finite collision volume (80 × 32 × 85 mm). The diagram's Z = 0 is the bed surface. This is a simulated obstacle, not a human safety separation model.

## Save student progress

The full-width 3D canvas is the workspace. Movement and Capture are compact overlay cards; portrait devices place them near the bottom and frame the robot above them. Choose XYZ, joint sliders or jog from the movement selector. Collapse movement for a larger view. View settings and workspace utilities stay in small menus.

**Capture** adds a position or a gripper/check command without showing the entire sequence. **Review** hides movement controls and shows the program. Selecting a saved position displays its blue ghost without moving the robot. Use **Adjust position** to show controls, move the arm, and replace that saved pose. Selected steps can also be renamed, reordered or deleted. **Step** executes one instruction at a time and opens movement controls; **Run** executes from reset. Manual movement or program edits restart the next single-step run from the beginning. On very small or short screens, cards scroll internally while the scene remains visible.

Use **Export progress** to download a JSON file containing the current task, robot and objects, program, placement plan, learning progress, explanation, timing and assessment state. **Import progress** restores a stopped session. Resume a saved timed attempt explicitly; time away from the saved session is excluded.

Keep exported files when switching devices or ending a lesson. This static site does not upload student progress to a server.

## Hosting

This repository contains the prepared static website. GitHub Pages publishes the `main` branch at its root. Keep `index.html`, `app.js`, `style.css`, `LICENSE`, `THREE-LICENSE.txt` and `CANNON-LICENSE.txt` together when hosting a copy.

No account, API key or backend is needed. Teaching guidance is authored into the application; **live AI chat is not enabled in this edition**. Never put an API key in a public website or repository.

## Simulation limits

This is an educational model, not a real robot safety system or an exact industrial digital twin. It uses sampled motion checks and conservative collision bounds for the gripper, held cargo, task surfaces and obstacles. Cargo uses simplified rigid-body gravity and contact physics, with illustrative friction and rebound. It does not model all robot forces or arm/base/self-collisions. Placement assistance is intentionally forgiving. A clear preview means no blockage was found by these simulation checks; it is not a hardware safety guarantee.

The current release passed 124 automated tests. Browser checks verified optional simulation playback, returning to the student’s unchanged work after completion or early close, desktop/mobile layout, and the absence of playback panels and action highlights during the simulation.

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
