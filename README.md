# Robot Lab — Christopher Hansen for BNTA

**Developed by Christopher Hansen for BNTA.** BNTA is Beijing New Talent Academy / 北京市新英才学校.

A bilingual robotics learning environment that helps students gain confidence with robot control, build a movement program, and test a solution to a practical loading problem. Designed around lower-secondary learners, including Grade 7 students, as preparation for work with physical robots.

[Open Robot Lab](https://zhinii.github.io/bnta-robotics/) · [GitHub repository](https://github.com/zhinii/bnta-robotics) · [MIT license](LICENSE)

## Learn, plan, program

1. Choose English or 简体中文, then a lesson, demonstration, guided practice, or the independent mission.
2. Learn the six joints, gripper, coordinates, movement controls, program area and sensor feedback. Watch a demonstration, repeat it, play the program you built, and check your understanding with a quiz.
3. Design an arrangement of six boxes in a limited truck bed. Use dimensions, rotation, local zero and centre coordinates to connect mathematics to actual placements. Explain what you are optimizing.
4. Move the robot and record positions; add Open, Close and Wait DI1 in order. Test and improve the sequence.
5. Progress to stacking in two levels while working around an obstacle.

The planner asks for **box placements, not route waypoints**. Assessment gives up to **45 points for space efficiency, 40 for placement accuracy and 15 for time**. Placement accuracy allows 5 mm and 5° before deductions. Collision checks remain active: a geometrically compact arrangement may leave insufficient room for the gripper. Time targets are provisional classroom goals; scores are feedback on the simulation, not proof of learning.

## See the movement

- **Orange trail:** where the tool has actually travelled.
- **Dashed blue path:** expected tool-centre movement when you set a coordinate target.
- **Red marker and translucent robot/gripper/load:** the first predicted blockage. Any red continuation is unchecked.
- **Preview program path:** checks the saved sequence from the reset state, including grip/release commands, without moving the live robot or boxes. It stops at the first failure, matching the execution checks.

Trail and path visibility can be toggled. Joint sliders and XYZ/jog controls offer different ways to explore movement. The shoulder has a dedicated mounting bracket above the base; this visual refinement does not change the joint axes or link lengths.

## Choose orientation and movement

- **Keep current:** the default when switching from joints to coordinates; preserves current roll and pitch. Rz remains an explicit editable target.
- **Allow rotation:** position-only solving; the robot may rotate the gripper to reach the target. Rz input is disabled. Inspect the ghost tool before moving.
- **Point downward:** an optional pickup aid. Guided pickup/placement shortcuts select this visibly.
- **Direct tool movement:** follows the requested tool path in small Cartesian segments. Placement assistance may add a final alignment.
- **Joint movement to target:** solves the destination pose, then turns the joints together. The tool can follow a curved path.

Collision checks and joint limits remain active for every choice. Feedback distinguishes a constrained-orientation failure from a solver failure and detected collisions. Position, orientation, path and successful grip are separate conditions.

Recorded moves retain their path and orientation settings; the step editor exposes both. New progress exports use version 3. Existing version 2 project files and legacy cargo programs remain importable with their original downward/direct settings. Older app versions may reject new exports rather than silently lose these settings.

Stacking includes synchronized plan/front/side diagrams and a scale standing person within the existing finite collision volume (80 × 32 × 85 mm). The diagram's Z = 0 is the bed surface. This is a simulated obstacle, not a human safety separation model.

## Save student progress

The workspace adapts to the window: wide landscape screens show the 3D scene, movement controls and program in three columns. Narrower tablet and desktop windows put the controls below the scene while retaining a compact program column, at least 260 CSS pixels wide. Phone-sized screens stack the panels. Extra width goes to the scene; controls remain readable and scroll when height is limited.

Use **Export progress** to download a JSON file containing the current task, robot and objects, program, placement plan, learning progress, explanation, timing and assessment state. **Import progress** restores a stopped session. Resume a saved timed attempt explicitly; time away from the saved session is excluded.

Keep exported files when switching devices or ending a lesson. This static site does not upload student progress to a server.

## Hosting

This repository contains the prepared static website. GitHub Pages publishes the `main` branch at its root. Keep `index.html`, `app.js`, `style.css`, `academy-logo.svg`, `LICENSE` and `THREE-LICENSE.txt` together when hosting a copy.

No account, API key or backend is needed. Teaching guidance is authored into the application; **live AI chat is not enabled in this edition**. Never put an API key in a public website or repository.

## Simulation limits

This is an educational model, not a real robot safety system or an exact industrial digital twin. It uses sampled motion checks and conservative collision bounds for the gripper, held cargo, task surfaces and obstacles. It does not simulate complete rigid-body dynamics, friction, forces or all arm/base/self-collisions. Placement assistance is intentionally forgiving. A clear preview means no blockage was found by these simulation checks; it is not a hardware safety guarantee.

The current local release passed 95 automated tests, with desktop and tablet-sized browser checks for motion previews, collision feedback and the updated shoulder connection.

## Credit and license

**Copyright (c) 2026 Beijing New Talent Academy / 北京市新英才学校 and Christopher Hansen.**

Original project software and documentation are available under the [MIT License](LICENSE). Keep the copyright notice and complete MIT permission notice in copies or substantial portions of the software. MIT permits use, modification and redistribution, including commercial use.

**Sharing or adapting Robot Lab? Credit Christopher Hansen, BNTA, or both.** Link back to this repository so others can find the original project. Use any of these short credits:

- Robot Lab — developed by Christopher Hansen.
- Robot Lab — Beijing New Talent Academy (BNTA).
- Robot Lab — developed by Christopher Hansen for BNTA.

This is our request for visible project recognition. The MIT license's legal requirement is to retain the complete copyright and permission notices; a short visible credit to either party does not replace those notices. This request does not add a restriction to the MIT license.

**署名与许可：** 本项目由 Christopher Hansen 为北京市新英才学校（BNTA）开发。分享或改编时，请注明 Christopher Hansen、BNTA 或双方，并链接到本项目。可见署名是我们的项目致谢请求，并非 MIT 的额外限制。复制、修改或分发软件时，仍须保留包含双方姓名的完整版权声明及 MIT 许可声明；简短署名不能替代这些声明。

- Three.js retains its own copyright and MIT notice in [THREE-LICENSE.txt](THREE-LICENSE.txt).
- School names, logos and trademarks are excluded from this project's MIT grant. Obtain the relevant permission or replace the branding when creating your own version.
- The arm appearance is FAIRINO-inspired; no endorsement or affiliation with FAIRINO Robotics is claimed.
