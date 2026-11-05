# Robot challenges · 机器人挑战

The default `beginner-3axis/` entry is a bilingual challenge-only robot workspace. It contains no lesson sequence, vocabulary tour, quiz, prediction prompt or reflection flow. All three tasks run locally in the browser without AI or an API key.

## Explore and three challenges

| Difficulty | Robot | Task |
|---|---|---|
| Explore | Six joints | Free play with three blocks. Pick up, move, put down and pick up again, with no objective or completion gate. |
| Easy | Three positioning joints | Pick up the part and place it using shared-world X/Y/Z coordinates. |
| Medium | Six joints | Grip the long part, tilt it through the closed 30° slot in a tall wall, and release in the matching destination cradle. |
| Hard | Two six-joint arms | A picks up the part, both arms align at the transfer marks, B closes its gripper, A opens its gripper, then B moves and places it. |

Six-axis tasks open with J1–J6 sliders and numerical angle fields. An XYZ helper preserves the tool's current orientation; wrist rotation remains necessary to fit the medium task. Typing XYZ coordinates or moving their sliders immediately displays a target cross and a ghost arm when a reachable pose exists. XYZ keeps the wrist attitude selected in the joint preview. An unreachable target remains marked in red with a bilingual explanation; it never silently disappears or enables Move. Preview does not move an arm, record a step or change who holds the part.

Explore is always unlocked. It starts with XYZ controls and offers the same joint controls and pose preview. Blocks settle onto the work surface or another block when released, remain at their new positions, and can be picked up again. Their current coordinates stay visible. There are no task stands, success/failure targets or forced restarts. Collision and joint-limit feedback still apply; Record/Replay and portable program files are optional. Explore replay finishes normally without awarding challenge progress. Reset restores the three blocks while keeping the program.

## Simple programming

Select A or B before operating or adding a step. One ordered program labels every step with its arm; execution is sequential, so the two arms coordinate through explicit movement and handoff steps. This version does not run two independent programs simultaneously.

**Record** resets the scene, replaces the current program, and records each executed move, gripper action and handoff, including an action that drops the part. Target previews and rejected/interrupted actions are not recorded. **Finish**, then **Replay** beside Record. You can also add a previewed move and gripper action without executing it. Preview, reorder or remove rows. **Replay** checks the sequence, resets the scene, then animates it. In Hard, an unsupported release or a move while both arms grip produces a visible drop and a failed attempt. Playback reaches the offending action, drops the part, then stops with a bilingual explanation and Restart button. Failed actions do not increase move/action counts or complete the challenge. Pause and Stop are always available; Stop keeps the current pose and recorded steps; stopping an already falling part still leaves the attempt failed. Reset keeps the program.

The replay dashboard shows simulated execution time, completed/total moves and completed/total actions. Every action, including gripper changes and handoffs, contributes its model duration; pauses and thinking time are excluded. Timing is independent of display frame rate. Stopped, invalid and unfinished challenges are labelled separately from valid completed results. Each completed program row shows its own duration. Editing a program clears stale timing; exported JSON includes the latest replay result for assessment (import ignores claimed results and measures a fresh replay). Compare successful attempts within the same difficulty.

All challenges reuse the white/orange FAIRINO-inspired robot geometry from the main Robot Lab (`robot-arm-lab/src/scene.js`), extracted directly into `fairino-arm.mjs`: the original lathed shells, joint covers, screw patterns, pedestal, base plate and gripper. Both hard-mode arms use the same model. The adapter places it on the challenge joint poses; the preview uses the same geometry. Gripper and shell collision bounds follow the restored dimensions; the medium wall is 540 mm tall, with a closed 132 × 64 mm slot tilted 30° in the Y–Z plane. The 112 mm part fits when tilted; the level part collides with the slot. Convex wall panels and oriented-box collision checks share the rendered opening. The slot is at X 215, Y 0, Z 180 mm, with the pickup in front and destination behind. Going around or over the wall does not satisfy the task. Small decorative details remain visual approximations.

Manual placement is practice, never a challenge pass. Completion requires replay from the initial scene, every recorded step finishing, and all physical task conditions being met. Paused, stopped, incomplete or failed playback cannot pass. Editing, importing or restarting clears the current verified result. Each successful replay unlocks the next difficulty; earned unlocks persist on this device (challenge revision 2). Old completion claims are not migrated.

The iPad layout keeps Record, Replay, timer, motion controls and command input available. Landscape uses a scene/control split; portrait places the scene above a two-column joint panel. The large scene labels, introductory task card and legend disappear on the first coordinate/joint edit, slider adjustment or replay. Reset, a new recording or a new challenge restores them. Small pickup/place/slot/handoff coordinates remain visible outside the 3D viewport. Current position and current target are pinned above the scrolling Controls/Program content, with the active arm and step shown during replay. Orange/green target markers and the position preview remain available after the labels disappear.

Each difficulty has its own program saved under `bnta:robot-challenges:v1`. Save/Open file exports and validates a portable JSON program. Reload restores programs with motion stopped and the scene at its start. Earlier course saves are not read or overwritten.

English and Chinese interface strings, task instructions, commands and errors are paired in `challenge-i18n.mjs`. Type `help` / `帮助` for commands. No commands or learner text are sent to a server.

## Run and verify

From this directory, run `python server/serve.py --port 4223`, then open `http://127.0.0.1:4223/beginner-3axis/`. `challenge.html` is an identical preview entry. Do not open through `file://`.

- `node tests/challenge-explore.browser.mjs`: unlocked free play, all three blocks, regripping, recording/replay, independent saves, import/export, reset/reload and bilingual tablet layouts. Uses `BNTA_PREVIEW_URL` and `BNTA_PLAYWRIGHT_PATH`.
- `npm run test:challenges`: pure model, contact geometry, finger closing sweeps, failure/restart, ownership, replay and bilingual checks.
- `node tests/challenge-handoff.browser.mjs`: real angled pickup, recorded drops, missing grips/releases, bilingual restart and successful replay. Uses `BNTA_PREVIEW_URL` and `BNTA_PLAYWRIGHT_PATH`.
- `npm run test:dom`: default interface, preview, Chinese commands, arm selection and saved programs.
- `npm run test:browser -- <Playwright-module-path>`: actual Edge walkthrough of all three tasks, responsive layouts, pause/stop, export, reload and file validation. `BNTA_PREVIEW_URL` can select another preview; `BNTA_SCREENSHOTS` selects the evidence directory.
- `node tests/challenge-xyz.browser.mjs`: typed coordinate and slider previews, unreachable target feedback, recovery, recording only on Move, and preserving a draft wrist pose. Uses `BNTA_PLAYWRIGHT_PATH`.
- `npm run test:ipad`: actual touch-browser recording/replay through all three tasks, progression gates, bilingual iPad portrait/landscape, edits/import/stopped replay. Set `BNTA_PLAYWRIGHT_PATH` if Playwright is outside this package.
- `npm test`: model tests including the preserved earlier modules.

## Model and source boundaries

`challenge-model.mjs` owns state, sampled joint paths, arm/gate/table collision checks, gripper attachment, handoff and completion. `challenge-scene.mjs` renders that same geometry. `challenge-ui.mjs` owns the interface and simple program list.

Easy mode reuses the existing three-axis kinematics in `model.mjs`. `challenge-kinematics.mjs` is a self-contained copy of the established `six-axis-agent/kinematics.mjs`; the separate six-axis application is not edited. Both arms share one world frame and keep separate joint states.

This is an educational geometric simulation with a simplified falling animation, not a force, friction or impact solver or a hardware controller. Pickup clips the oriented part against the actual finger contact volume: it allows offsets and varied tool angles when both jaws can contact the part, without a fixed 3 mm pickup point or level-wrist requirement. Fingers may touch the graspable part during approach; palm, link, wall and other-arm collisions remain errors. Closing checks the finger sweep, and the visual jaws stop against the detected part surfaces. A missed Hard-mode close can close empty; it never attaches the part remotely. Placement accepts a small support tolerance. Handoff has separate recorded actions: B closes around a free section, then A opens. Releasing without support or moving while both grip drops the part and latches failure until a fresh attempt; B may open again to cancel its grip safely. Releasing A transfers ownership without teleporting the part, and B can then move. Both robots remain subject to collision checks. Older saved one-click handoff steps are expanded into B Close and A Open when loaded. Program completion comes from the actual challenge state, not from running a fixed number of steps.

Previous course source and named historical entries remain in the repository for preservation; the default challenge app imports none of their lesson content. Robot Lab was developed by Christopher Hansen. See the repository license and vendored Three.js license/provenance files.
