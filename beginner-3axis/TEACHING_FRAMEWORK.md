# Robot Lab teaching framework

Audience: Grade 7 and above, no robotics background. This first machine is a three-axis articulated arm with an independent open/close gripper. It has no independently controlled wrist.

## Learner sequence

Learn and Explore are distinct presentations. All lessons use **Vocabulary → Concept with inline example → Assessment**. Learners read one concept and play its example without losing the explanation. Lessons 4–6 explicitly separate **Predict → Operate → Explain**: see the live task and write a prediction, save it to open the operation controls, then review actual evidence and answer the explanation question directly above its text box. Saved predictions can be revisited without restarting the attempt. Other practical assessments retain Operate and Explain & check. The lesson selector supports revisiting. Continue moves through phases; Next lesson requires evidence, not merely visiting cards. Examples cannot write student programs or award practical completion.

Vocabulary, concepts and written assessments are lesson pages without a background 3D workspace. Robot types use a single slide presentation, navigated by swipe, arrows, numbered controls or keyboard. Each robot’s concept is immediately followed by its demo, before introducing the next robot. Vocabulary comes first and assessment follows all five pairs. Continue, arrows and swipes use this same sequence; numbered robot buttons revisit that robot’s concept. Concept slides show each body's motion, useful job and trade-off. Demo slides use separate Three.js scenes: an articulated arm transfers a part, a gantry prints an outline, SCARA inserts a pin, a delta mechanism moves a part with three linked chains, and a wheeled carrier delivers a parcel. Play/Pause, Reset and scrubbing are available. Motion auto-plays once when entering a demo slide, except with reduced-motion preference. These are connected kinematic illustrations, not industrial dynamics or calibrated performance. They cannot mutate learner programs or award practical evidence.

The remaining six lessons are also split into short concept/demo pairs (see `lesson-units.mjs`). Anatomy separates J1, the shoulder/elbow links, and command/feedback. Coordinates separates angles from the measured vertical-move example. Grip, programming and obstacle lessons each demonstrate a small operation before practical work. Each example is optional to replay and cannot supply learner evidence. Lessons 4–6 use a compact operation station: live scene, XYZ inputs, Move, Open/Close, and only the recording/playback controls needed for that lesson. A current-action card replaces an always-expanded route list. Ghost targets, expected paths and actual trails remain available. Review shows checked evidence groups before reflection. The independent B task keeps given fixture coordinates visible, without supplying clearance choices or action order.

Lesson 7 breaks the proposal into four questions: useful human task, suitable body plan, benefit and limitation, and an interest to investigate. Save proposal identifies the first missing field and retains the other answers. Reflection follows a complete proposal; the final action exports the portfolio JSON. No AI connection is needed for saving or progression. Starting a new practical activity with a recorded program shows an in-app reset explanation, cancellation and JSON export option.

The robot-type assessment uses five original illustrated job cards and explicitly references the preceding demonstrations. Named replay buttons open the corresponding demo and provide a direct return to assessment without clearing answer selections. Reflection asks learners to compare observed movements and body plans.

Only after the robot-type assessment is complete does the concluding course message identify the focus: a three-axis articulated arm, J1 base rotation, J2 shoulder and J3 elbow, with a separate gripper action. Later arm-specific demos and practical assessments show the operating 3D workspace. Explore retains that workspace, target ghosts, predictive routes, actual trails and program tools.

Vocabulary terms are bold, dotted-underlined and focusable throughout lesson prose, questions and explanations, including dynamically shown content. Click/tap, Enter or Space opens the bilingual definition; Close, Escape or an outside tap dismisses it. Looking up a word does not operate the robot, save an answer or alter completion evidence. Native operation controls and editable student responses are not converted into glossary triggers.

1. **Robot types:** compare articulated, gantry, SCARA, delta and mobile bodies and their example jobs. Predict a suitable body for library shelves; match examples and explain a tradeoff.
2. **Anatomy:** inspect one concept at a time with only relevant callouts and an inline demonstration. In Try a joint, predict and manually turn J1 by 10 degrees. Identify six parts using A-F labels on the educational arm, one question at a time. Identify base, joint, link, actuator, controller and end effector. Explain why gripper opening is separate from the three positioning axes. Sensors, electricity and extra wrist axes are explained, not simulated.
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

Export JSON to keep the current scene, program, all attempts, predictions, calculations, controller events, explanations and help history. Open that JSON to resume or review. PNG images are separate files; retain them with the JSON/text report. Text is a readable evidence report. Names are optional. There is no server database. With AI disconnected, there is no response upload. With AI connected, relevant responses and simulator evidence are sent to Qwen for feedback; the interface explains this. Browser storage is a convenience copy, not a substitute for the export.

Matching submission shows an offline score, per-answer status and targeted hints. Hints count as assistance; AI is optional. A corrected answer does not invalidate an existing reflection solely because it was submitted later. Joint-operation evidence remains required, and missing work is named explicitly.

Completion means the specified evidence exists. It is **not** a grade for the quality of reasoning, proof of authorship or a tamper-resistant certification. JSON can be edited outside the application; teachers should discuss the student's explanation and demonstrations.

## Guidance and simulator limits

The operational guide is explicitly an **offline scripted guide**. A separate optional **Qwen assessment dialogue** discusses saved predictions, answers and reflections. Without AI, these remain saved reflections for teacher review. With AI, saving automatically requests feedback, followed by learner replies and revisions. Connection failures preserve saved work and never block progress.

The AI receives a trusted per-lesson reference, the learner response and a bounded snapshot of actual recorded actions, current position, gripper status, recent errors and measurements. It must distinguish recorded events from learner claims and ask a focused follow-up instead of inventing results. This is a server integration, not a claim that live model quality has been verified locally. It cannot operate the robot or award completion. AI assistance and dialogue appear in the portfolio; independent-task feedback is deferred until the delivery test. Open-ended reasoning still requires teacher review. API keys stay on the server.

The simulation checks simplified geometric collisions, joint limits, timed kinematic movement and fixture-supported grasp/release. Gravity, payload, forces, friction, impacts and electrical behaviour are not simulated. Joint covers, link housings and the controller drawing are illustrative; collision proxies remain conservative teaching geometry, not an industrial safety model. The new jaw bridge is included in collision checks.

## Reusing the framework

`curriculum.mjs` defines bilingual goals, concepts, examples, predictions, practical tasks and reflection prompts. `lesson-vocabulary.mjs` supplies terms; `lesson-glossary.mjs` provides definitions in context. `type-simulations.mjs` presents the slide deck; `robot-type-motion.mjs` defines the illustrative geometry and `robot-type-scene.mjs` renders it. `learning-flow.mjs` presents phases without defining robot physics. `lessons.mjs` evaluates operation evidence; `controller.mjs` provides verified events. `storage.mjs` validates and exports projects. For a new simulated machine, provide its model/controller, demonstration commands and evidence predicates; keep phase navigation, explanation/measurement distinctions, file workflow and teacher review pattern.


### Focused progression in Lessons 1–3

The first three lessons retain vocabulary as a separate first stage, then pair each concept with an inline, isolated demonstration. Assessment is separate. Lesson 1 presents one robot/job scenario at a time. Lesson 2 uses focused J1 operation and lettered anatomy. Lesson 3 uses a learner-entered Z target with X/Y held fixed, asks the learner to inspect real joint changes, and calculates displacement, distance and average speed from that completed move. Its demonstration shows a worked calculation from separate example data. Demonstrations never count as learner operation. Reflection and saved evidence precede progression; reflection quality still requires teacher review or optional AI dialogue, not a claim of automatically proven understanding.
