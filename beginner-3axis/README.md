# Robot challenges · 机器人挑战

The default `beginner-3axis/` entry is a bilingual challenge-only robot workspace. It contains no lesson sequence, vocabulary tour, quiz, prediction prompt or reflection flow. All three tasks run locally in the browser without AI or an API key.

## Three challenges

| Difficulty | Robot | Task |
|---|---|---|
| Easy | Three positioning joints | Pick up the part and place it using shared-world X/Y/Z coordinates. |
| Medium | Six joints | Grip the long part, rotate it to fit through the narrow gate, and align it with the destination slot. |
| Hard | Two six-joint arms | A picks up the part, both arms align at the transfer marks, B closes its gripper, A opens its gripper, then B moves and places it. |

Six-axis tasks open with J1–J6 sliders and numerical angle fields. An XYZ helper preserves the tool's current orientation; wrist rotation remains necessary to fit the medium task. Targets appear as a ghost before movement. Preview does not move an arm or change who holds the part.

## Simple programming

Select A or B before operating or adding a step. One ordered program labels every step with its arm; execution is sequential, so the two arms coordinate through explicit movement and handoff steps. This version does not run two independent programs simultaneously.

**Record new attempt** resets the scene, replaces the current program, and records each successfully completed move, gripper action and handoff. Target previews and rejected/interrupted actions are not recorded. **Finish recording**, then open Program and **Run from start**. You can also add a previewed move and gripper action without executing it. Preview, reorder or remove rows. **Run from start** checks the sequence, resets the scene, then animates it. A premature move during a shared grip is demonstrated up to the offending step: playback stops there with a bilingual error, both grippers still closed and the part unmoved. Failed actions do not increase move/action counts or complete the challenge. Pause and Stop are always available; Stop keeps the current pose and recorded steps. Reset keeps the program.

The replay dashboard shows simulated execution time, completed/total moves and completed/total actions. Every action, including gripper changes and handoffs, contributes its model duration; pauses and thinking time are excluded. Timing is independent of display frame rate. Stopped, invalid and unfinished challenges are labelled separately from valid completed results. Each completed program row shows its own duration. Editing a program clears stale timing; exported JSON includes the latest replay result for assessment (import ignores claimed results and measures a fresh replay). Compare successful attempts within the same difficulty.

All challenges reuse the white/orange FAIRINO-inspired robot geometry from the main Robot Lab (`robot-arm-lab/src/scene.js`), extracted directly into `fairino-arm.mjs`: the original lathed shells, joint covers, screw patterns, pedestal, base plate and gripper. Both hard-mode arms use the same model. The adapter places it on the challenge joint poses; the preview uses the same geometry. Gripper and shell collision bounds follow the restored dimensions; the medium gate opening is 76 mm wide and its walls are 210 mm high so the full-size model can pass while the 84 mm part still needs rotation. Small decorative details remain visual approximations.

Each difficulty has its own program saved under `bnta:robot-challenges:v1`. Save/Open file exports and validates a portable JSON program. Reload restores programs with motion stopped and the scene at its start. Earlier course saves are not read or overwritten.

English and Chinese interface strings, task instructions, commands and errors are paired in `challenge-i18n.mjs`. Type `help` / `帮助` for commands. No commands or learner text are sent to a server.

## Run and verify

From this directory, run `python server/serve.py --port 4223`, then open `http://127.0.0.1:4223/beginner-3axis/`. `challenge.html` is an identical preview entry. Do not open through `file://`.

- `npm run test:challenges`: pure model, collision, ownership, replay and bilingual checks.
- `npm run test:dom`: default interface, preview, Chinese commands, arm selection and saved programs.
- `npm run test:browser -- <Playwright-module-path>`: actual Edge walkthrough of all three tasks, responsive layouts, pause/stop, export, reload and file validation. `BNTA_PREVIEW_URL` can select another preview; `BNTA_SCREENSHOTS` selects the evidence directory.
- `npm test`: model tests including the preserved earlier modules.

## Model and source boundaries

`challenge-model.mjs` owns state, sampled joint paths, arm/gate/table collision checks, gripper attachment, handoff and completion. `challenge-scene.mjs` renders that same geometry. `challenge-ui.mjs` owns the interface and simple program list.

Easy mode reuses the existing three-axis kinematics in `model.mjs`. `challenge-kinematics.mjs` is a self-contained copy of the established `six-axis-agent/kinematics.mjs`; the separate six-axis application is not edited. Both arms share one world frame and keep separate joint states.

This is an educational geometric simulation, not a hardware controller: no force, friction, gravity, impact dynamics or safety-rated collision guarantees. A part can be released on its task stands or into the other arm’s secured grip. Handoff has separate recorded actions: B closes at the free end, then A opens. While both grip, moving either arm is blocked with an error; B may open again to cancel its grip. Releasing A transfers ownership without teleporting the part, and B can then move. Both robots remain subject to collision checks. Older saved one-click handoff steps are expanded into B Close and A Open when loaded. Program completion comes from the actual challenge state, not from running a fixed number of steps.

Previous course source and named historical entries remain in the repository for preservation; the default challenge app imports none of their lesson content. Robot Lab was developed by Christopher Hansen. See the repository license and vendored Three.js license/provenance files.
