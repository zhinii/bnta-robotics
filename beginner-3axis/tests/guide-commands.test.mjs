import test from 'node:test';
import assert from 'node:assert/strict';
import { parseGuideCommand as parse } from '../guide-commands.mjs';

test('offline commands distinguish targets from execution and preserve signed coordinates', () => {
  assert.deepEqual(parse('target X=120 Y=-80 Z=100'), {type:'target', values:[120,-80,100]});
  assert.deepEqual(parse('move 120, -80, 100.5'), {type:'move-target', values:[120,-80,100.5]});
  assert.deepEqual(parse('移动 120 -80 100'), {type:'move-target', values:[120,-80,100]});
});
test('questions and malformed commands never become robot actions', () => {
  for (const input of ['why did it move?', 'do not close', 'move 1 2', 'move 1 2 Infinity', 'lesson 8', 'run then reset', '<script>alert(1)</script>'])
    assert.equal(parse(input).type, 'question', input);
});
test('navigation and recording work in both interface languages', () => {
  assert.deepEqual(parse('lesson 7'), {type:'lesson',index:6});
  assert.deepEqual(parse('课程 2'), {type:'lesson',index:1});
  assert.equal(parse('任务3').type, 'obstacle');
  assert.equal(parse('record off').type, 'record-off');
  assert.equal(parse('停止').type, 'stop');
});
