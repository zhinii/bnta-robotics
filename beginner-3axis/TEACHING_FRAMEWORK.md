# Robot Lab teaching framework

Audience: Grade 7 and above, no robotics background. This first machine is a three-axis articulated arm with an independent open/close gripper. It has no independently controlled wrist.

## Learner sequence

Each lesson uses **Understand → Watch → Try → Review**. The lesson selector supports revisiting. Continue moves through phases; Next lesson requires evidence, not merely visiting cards. Examples run in a separate model world and cannot write student programs or award practical completion.

1. **Robot types:** compare articulated, gantry, SCARA, delta and mobile bodies and their example jobs. Predict a suitable body for library shelves; match examples and explain a tradeoff.
2. **Anatomy:** watch the three joints separately, then move a joint personally. Identify base, joint, link, actuator, controller and end effector. Explain why gripper opening is separate from the three positioning axes. Sensors, electricity and extra wrist axes are explained, not simulated.
3. **Coordinates and angles:** predict a 10 mm vertical move, execute it, inspect multiple joint changes. Calculate signed Z displacement, path distance and average speed using measured simulated time. Millimetres are distinct from degrees. No trigonometry or Pythagoras is required.
4. **Gripping:** approach while open, close on the part, check actual attachment and lift 10 mm. Explain the difference between a command and evidence of a successful grasp. Fixture entry targets expose the model's approach requirement.
5. **Programming:** predict order; reset, record a route, stop recording, reset and replay. Try pause/stop, recover and complete a run. Explain a test, a problem and an improvement. Recording is OFF by default; merely exploring the gripper does not add commands.
6. **Obstacle and changed task:** deliberately test a blocked direct route, observe no movement, and improve the route using clearance. Then independently record and replay delivery to B. B's goal and fixture entry geometry are given; the learner chooses movement order and clearance. No example or hint controls are available in that independent attempt.
7. **Application and interests:** watch a worked supply-to-assembly example, propose a useful human task, select a body plan, discuss a benefit and limitation, and cite tested evidence. Select an interest and a next investigation.

## Evidence and teacher discussion

| Outcome | Automatically recorded evidence | Teacher judgement |
|---|---|---|
| Operates intentionally | Actual moves, grasps, releases, resets, program edits and replay results | Can the student explain command versus feedback? |
| Uses mathematics | Actual +10 mm move, before/after angles, model duration, checked displacement/distance/speed calculation | Can the student explain units and choose a method in a changed situation? |
| Tests and improves | Rejected route, successful detour, edited program and changed-target replay | Was the revision purposeful? Does the explanation match the evidence? |
| Transfers independently | A new or revised recorded program replayed to B, with help history | Can the learner apply the idea to another machine or job? |
| Identifies interests | Student-authored design and reflection, optional scene image | Is the proposal connected to a real person's needs? What is the next learning step? |

Export JSON to keep the current scene, program, all attempts, predictions, calculations, controller events, explanations and help history. Open that JSON to resume or review. PNG images are separate files; retain them with the JSON/text report. Text is a readable evidence report. Names are optional. There is no server database or student-data upload. Browser storage is a convenience copy, not a substitute for the export.

Completion means the specified evidence exists. It is **not** a grade for the quality of reasoning, proof of authorship or a tamper-resistant certification. JSON can be edited outside the application; teachers should discuss the student's explanation and demonstrations.

## Guidance and simulator limits

The tutor is explicitly an **offline scripted guide**, not a completed AI teaching agent. It receives verified current position, target, gripper/held status, error codes and evidence identifiers. Rejected actions trigger an explanation; requested hints progress from questions toward useful suggestions. It cannot operate the robot or claim a failed move happened. A future live AI adapter should receive this bounded state and cite event IDs, while all completion checks stay deterministic and teacher judgement remains separate. No API key belongs in this static module.

The simulation checks simplified geometric collisions, joint limits, timed kinematic movement and fixture-supported grasp/release. Gravity, payload, forces, friction, impacts and electrical behaviour are not simulated. Joint covers, link housings and the controller drawing are illustrative; collision proxies remain conservative teaching geometry, not an industrial safety model. The new jaw bridge is included in collision checks.

## Reusing the framework

`curriculum.mjs` defines bilingual goals, concepts, examples, predictions, practical tasks and reflection prompts. `learning-flow.mjs` presents phases without defining robot physics. `lessons.mjs` evaluates operation evidence; `controller.mjs` provides verified events. `storage.mjs` validates and exports projects. For a new simulated machine, provide its model/controller, demonstration commands and evidence predicates; keep phase navigation, explanation/measurement distinctions, file workflow and teacher review pattern.
