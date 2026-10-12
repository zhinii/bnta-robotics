# Beginner learner review — 12 October 2026

Inspected feature branch `feat/three-axis-learning-lab` at `d6e70a9` before editing. The original root application is outside this revision. No supplied code was assumed to be accepted design.

## Useful work to preserve

- Actual three-revolute-joint kinematics, a fixed tool mount and independent gripper.
- Controller-generated evidence; target editing is distinct from actual motion.
- Collision preflight, recording of completed actions, replay, pause/stop/reset.
- Offline bilingual resources, local JSON evidence and independent changed-target checks.
- Responsive scene, camera framing and compact operation controls.

## Largest gaps observed

1. **Disconnected mechanism:** the two fingers have no slide housing linking them to the palm. The base/shoulder also needs a continuous turret neck.
2. **Learn has no understandable journey:** clicking it scrolls past the robot into a long page of prediction, descriptions, matching questions and a collapsed reflection. There is no clear next step. Matching five robot types is asked before any example.
3. **Hidden practical requirements:** resetting before recording, a specific pickup approach and exact clearance heights are scored but not presented as a usable checklist at the point of action.
4. **Mathematics is mostly incidental:** coordinates and joint changes exist, but students are not asked to calculate displacement, distance or speed from measurements.
5. **Tutor is reactive scripted text:** no live AI, no automatic teaching intervention. It must be labelled honestly and use only actual telemetry.
6. **Portfolio is incomplete:** JSON/text exports exist, but no restore workflow, image capture or explicit calculation evidence. Reflection is self-reported; completion is not proof of understanding.
7. **Mobile lesson layout:** the large lesson sits below the controls; getting to a form can separate instructions from the action and scene. Desktop Learn can scroll the robot off screen entirely.

## Revision priorities

Connect the physical drawing AND collision model. Organize each lesson into Understand, Watch, Try and Review; keep the scene visible alongside the current instruction. Use examples before questions, state-backed practical checklists, visible recovery controls, measured calculations and a separate changed task. Keep reading short and optional detail expandable. Add file-based save/restore and image evidence. Label the coach as an offline scripted guide; retain a clear adapter boundary for a future reviewed AI service.

## Acceptance evidence

See `LOCAL_VERIFICATION.md` for the post-change test and browser results. A desktop browser resized to phone/tablet dimensions is responsive-browser evidence, not a claim of hands-on iOS/Android testing. No public Pages release is part of this local review.
