# Robot Lab — Christopher Hansen & BNTA

**Developed by Christopher Hansen for Beijing New Talent Academy (BNTA) / 北京市新英才学校.**

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

## Save student progress

Use **Export progress** to download a JSON file containing the current task, robot and objects, program, placement plan, learning progress, explanation, timing and assessment state. **Import progress** restores a stopped session. Resume a saved timed attempt explicitly; time away from the saved session is excluded.

Keep exported files when switching devices or ending a lesson. This static site does not upload student progress to a server.

## Hosting

This repository contains the prepared static website. GitHub Pages publishes the `main` branch at its root. Keep `index.html`, `app.js`, `style.css`, `academy-logo.svg`, `LICENSE` and `THREE-LICENSE.txt` together when hosting a copy.

No account, API key or backend is needed. Teaching guidance is authored into the application; **live AI chat is not enabled in this edition**. Never put an API key in a public website or repository.

## Simulation limits

This is an educational model, not a real robot safety system or an exact industrial digital twin. It uses sampled motion checks and conservative collision bounds for the gripper, held cargo, task surfaces and obstacles. It does not simulate complete rigid-body dynamics, friction, forces or all arm/base/self-collisions. Placement assistance is intentionally forgiving. A clear preview means no blockage was found by these simulation checks; it is not a hardware safety guarantee.

The current local release passed 87 automated tests, with desktop and tablet-sized browser checks for motion previews, collision feedback and the updated shoulder connection.

## Credit and license

**Copyright (c) 2026 Beijing New Talent Academy / 北京市新英才学校 and Christopher Hansen.**

Original project software and documentation are available under the [MIT License](LICENSE). Keep the copyright notice and complete MIT permission notice in copies or substantial portions of the software. MIT permits use, modification and redistribution, including commercial use.

Suggested visible credit, appreciated but not an additional MIT requirement:

> Based on Robot Lab, developed by Christopher Hansen for Beijing New Talent Academy (BNTA) / 北京市新英才学校 — https://github.com/zhinii/bnta-robotics — MIT License.

**署名与许可：** 本项目由 Christopher Hansen 为北京市新英才学校（BNTA）开发。复制、修改或分发本软件时，请保留 Christopher Hansen 与北京市新英才学校的版权声明及完整 MIT 许可声明，并附带 LICENSE 文件。

- Three.js retains its own copyright and MIT notice in [THREE-LICENSE.txt](THREE-LICENSE.txt).
- School names, logos and trademarks are excluded from this project's MIT grant. Obtain the relevant permission or replace the branding when creating your own version.
- The arm appearance is FAIRINO-inspired; no endorsement or affiliation with FAIRINO Robotics is claimed.
