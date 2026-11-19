# Movement acceptance scenarios

A valid action schema and a collision-free path are necessary, but they do not by themselves prove that the command was accomplished. Check the final object state as well as the words in the reply.

| Student command | Required behaviour |
| --- | --- |
| Pick up the blue book and drop it off the desk. | Carry the entire notebook beyond a reachable desk edge, release, and let gravity settle it. A release over the desk does not satisfy this task. No coordinates required. |
| Drop it off the front edge. | Keep the named edge; do not substitute another side to get a successful plan. |
| Drop it off the back edge by the wall. | Reject a release position intersecting the wall, identify the wall, and leave the visible scene unchanged. |
| Drop it right here. | Open the gripper at its actual position. Do not return to the pickup location first. |
| Put it down. | Place on the current/pickup support, without demanding a new destination. |
| Drop the red book on the laptop. | Check the carrying path, release above the laptop and report the actual landing surface. |
| Don't drop it off the desk. Put it on the shelf. | Honour the positive shelf task. Negated drop language must not add an edge drop. |
| Pick up the book. | Ask which book when context does not identify one. No movement yet. |
| Nudge the blue book right. / 10 millimetres. | Ask the distance, retain the item/direction, then perform the measured follow-up. |
| Put the red book on the shelf too, in an empty spot. | Find free continuous shelf space without moving the item already there. |
| Put the loaded holder on the shelf. | Carry the holder with its contents; the writing tools remain inside. |
| Hello, wave to me! | Make a checked social gesture without moving desk objects. |
| What would happen if I dropped the book? | Explain the possible result without executing the hypothetical request. |
| 拿起蓝色的书，把它从桌子前沿扔下去。 | The same front-edge drop semantics and Chinese completion feedback. |

## Regression coverage

`task-outcomes.test.mjs` tests the captured faulty AI output (drop without coordinates), pick-plus-release alternatives, omitted action fields, negation, reference objects, held-object context, rotated footprints, all five movable items, blocked edges and grounded completion messages. `measurement.test.mjs` and `relative-movement.test.mjs` cover metric units, relative moves, release and gravity. Existing collision, holder, orientation and recording tests remain applicable.

`movement-scenarios.mjs` is an explicitly enabled real-model check. Set `BNTA_LIVE_SCENARIOS=1`, optionally `BNTA_SCENARIO_BROWSER=1` for Chrome and `BNTA_SCENARIOS` to a comma-separated list of IDs. The report distinguishes successful movement, a checked rejection, clarification and provider/transport failures. Provider failures are not passing movement results.

`movement.browser.mjs` checks the real page: English and Chinese commands, preview before movement, actual floor landing, grounded replies, practice versus recording, and playback of the falling object. `BNTA_LOCAL_SOURCE=1` is a source rehearsal, not evidence that GitHub assets have deployed. Omit it for final published-page verification.

The simulator settles objects vertically against geometry; it does not simulate rigid-body bouncing, tipping or throwing. All arm/gripper collision and joint-limit checks remain active.
