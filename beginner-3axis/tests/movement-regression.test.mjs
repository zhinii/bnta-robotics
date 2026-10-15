import test from "node:test";
import assert from "node:assert/strict";
import { Controller } from "../controller.mjs";
import { initialScene, preflightAction, sceneAtJoints } from "../planner.mjs";
import { fk, degreesToRadians as rad } from "../model.mjs";
import { exerciseGoal } from "../exercises.mjs";
import { validateStoredProgram } from "../storage.mjs";

const finish = (c) => {
  while (c.operation) c.tick(1e6);
};
function move(c, target) {
  for (const k of ["x", "y", "z"]) c.editTarget(k, target[k]);
  const r = c.move();
  assert.equal(r.ok, true, JSON.stringify(r.error));
  finish(c);
}
for (const task of ["transfer", "obstacle"])
  test(`${task}: rounded displayed coordinates, vertical pickup and recorded replay`, () => {
    const c = new Controller({
      scene: initialScene({ obstacle: task === "obstacle" }),
    });
    const source = { x: 147, y: -84.9, z: 80 },
      dest = { x: 147, y: 84.9, z: 80 };
    c.setRecording(true);
    move(c, { ...source, z: 130 });
    // Small successive moves are normal beginner exploration, not one exact corridor.
    for (const z of [110, 90, 80]) move(c, { ...source, z });
    assert.equal(c.state.scene.approachEvidence, null);
    assert.equal(c.grip("closed").ok, true);
    assert.equal(c.state.scene.objects[0].heldByGripper, true);
    move(c, { ...source, z: 130 });
    if (task === "obstacle") {
      const before = structuredClone(c.state.scene);
      for (const k of ["x", "y", "z"]) c.editTarget(k, dest[k]);
      const blocked = c.move();
      assert.equal(blocked.ok, false);
      assert.deepEqual(c.state.scene, before);
    }
    move(c, { ...dest, z: 130 });
    move(c, dest);
    assert.equal(c.grip("open").ok, true);
    assert.equal(c.state.scene.objects[0].supportedByFixtureId, "destinationA");
    const steps = c.state.program.steps.length;
    assert.equal(c.testProgram().ok, true);
    finish(c);
    assert.equal(exerciseGoal(task, c.state.program, c.state.scene), true);
    assert.equal(c.state.program.steps.length, steps);
    assert.equal(validateStoredProgram(c.state.program), true);
  });
test("joint and jog moves record, stop atomically, and replay their actual motion", () => {
  const c = new Controller();
  c.setRecording(true);
  const start = [...c.state.scene.actualJoints];
  assert.equal(c.moveJoint(0, start[0]).value.noop, true);
  assert.equal(c.state.program.steps.length, 0);
  assert.equal(c.moveJoint(0, rad(-10)).ok, true);
  finish(c);
  assert.equal(c.state.scene.actualJoints[1], start[1]);
  assert.equal(c.state.program.steps[0].motion, "joint");
  c.editTarget("x", 999); // unexecuted bad draft must not drive the jog
  const before = fk(c.state.scene.actualJoints).C;
  assert.equal(c.jog("z", 5).ok, true);
  finish(c);
  assert.ok(Math.abs(fk(c.state.scene.actualJoints).C.z - before.z - 5) < 1e-6);
  const end = structuredClone(c.state.scene);
  assert.equal(c.testProgram().ok, true);
  c.tick(50);
  c.pause();
  const paused = structuredClone(c.state.scene);
  c.tick(1000);
  assert.deepEqual(c.state.scene, paused);
  c.resume();
  finish(c);
  assert.deepEqual(c.state.scene.actualJoints, end.actualJoints);
  assert.equal(validateStoredProgram(c.state.program), true);
  const corrupt = structuredClone(c.state.program);
  corrupt.steps[0].angleRad = NaN;
  assert.equal(validateStoredProgram(corrupt), false);
  c.setRecording(false);
  c.reset();
  c.clearProgram(true);
  c.setRecording(true);
  assert.equal(c.moveJoint(0, rad(-20)).ok, true);
  c.tick(50);
  c.stop();
  assert.equal(c.state.program.steps.length, 0);
});
test("removing the hidden approach gate does not allow remote or misaligned grabs", () => {
  const scene = initialScene();
  assert.equal(
    preflightAction(scene, { type: "gripper", gripperState: "closed" }).value
      .endScene.objects[0].heldByGripper,
    false,
  );
  const aligned = sceneAtJoints(scene, [-30, 45, -90].map(rad));
  aligned.objects[0].worldForward = { x: 0, y: 0, z: 1 };
  const result = preflightAction(aligned, {
    type: "gripper",
    gripperState: "closed",
  });
  assert.ok(!result.ok || !result.value.endScene.objects[0].heldByGripper);
});
