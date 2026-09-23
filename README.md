# BNTA Robotics

**A Beijing New Talent Academy / 北京市新英才学校 project.**

An interactive robotics learning platform for exploring robot parts, movement, programming and problem-solving through guided lessons and practical challenges.

## Website
[Launch the simulator](https://zhinii.github.io/bnta-robotics/) · [Source repository](https://github.com/zhinii/bnta-robotics) · [MIT license](LICENSE)

This static edition includes 3D robot controls, expandable joints, gripper/suction/magnet challenges, movement programming, bilingual guided lessons, demonstration, student practice, program playback and a concept quiz.

The teacher provides authored lessons and built-in guidance. Live AI chat is disabled. No API key, backend or installation is required. Programs and course progress are stored in the current browser; use Export to keep a copy of a program.

## Hosting and updates
GitHub Pages publishes the main branch at its root. Upload the prepared static edition to update the website. Keep index.html, app.js, style.css and workspace.css from the same build. Do not upload API keys or server configuration.

This is a simplified teaching simulation, not a real robot safety system or an exact industrial robot model. Three.js license is included in THREE-LICENSE.txt.

## License and required attribution

Original project software and documentation are available under the [MIT License](LICENSE).

**Copyright (c) 2026 Beijing New Talent Academy / 北京市新英才学校.** If you copy, modify or redistribute this software, you must retain this copyright notice and the complete MIT permission notice in all copies or substantial portions. Keep the LICENSE file with your distribution. MIT permits educational and commercial use and modification.

Suggested visible credit (appreciated, but not an additional MIT requirement):

> Based on BNTA Robotics, a Beijing New Talent Academy / 北京市新英才学校 project — https://github.com/zhinii/bnta-robotics — MIT License.

**署名与许可：** 复制、修改或分发本项目时，须在所有副本或实质性部分中保留北京市新英才学校（BNTA）的版权声明和完整的 MIT 许可声明，并随分发版本附带 LICENSE 文件。

### Third-party materials and branding

- Three.js retains its own copyright and MIT notice in [THREE-LICENSE.txt](THREE-LICENSE.txt); retain that notice when redistributing the bundled library.
- School names, logos and other trademarks are excluded from this project's MIT grant. Obtain the relevant permission or replace the branding when creating your own version.
- The arm's appearance is FAIRINO-inspired. This project does not claim endorsement by or affiliation with FAIRINO Robotics.

## Start here
1. Choose English or 简体中文 when the app opens.
2. Choose Guided lesson, Quick tour, or Free practice. Free practice opens all controls without requiring a quiz.
3. Use Move robot · Controls inside the viewport to switch between sliders, XYZ coordinates and jog buttons. Live XYZ stays attached to the controls.
4. Record and run your movement program in the adjacent panel.

Tablets and desktops use a two-to-one viewport/program layout. Narrow viewports use a collapsible bottom control tray; phones stack the program below the robot. Camera framing adapts to the open controls. Language remains available from the English / 中文 button.

### Viewport controls

Joint sliders are always visible directly over the viewport. XYZ target sliders support numeric entry; select **Move to XYZ** to execute with reach and collision checks. Compact jog controls and step selectors share the overlay. Live position and orientation are displayed together at the top.
