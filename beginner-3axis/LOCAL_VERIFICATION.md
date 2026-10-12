# Local integration verification — 12 October 2026

Imported the supplied two-commit patch on `feat/three-axis-learning-lab` from
`25a1cd43c393ad16fa570529efe4ee97daf62035`. The imported tree matched
`a98920a684c20138bd3364e79ac7baae276821a2` before this verification note and the
module-only `.gitattributes` addition. No root application files were changed.

## Automated checks rerun here

- Node v24.19.0: `node --test beginner-3axis/tests/*.test.mjs` — 73 passed, 0 failed.
- `npm ci --ignore-scripts --no-audit --no-fund` installed the locked development dependencies.
- `npm run test:dom` — all supplied DOM checks passed: seven lessons, obstacle
  rejection, independent destination-B recorded replay, exports, reload/reset,
  preview/commit, nine-step recording/replay, pause/resume, stop/reset, editing,
  invalid input and language preservation.
- All nine original Git blobs match `baseline.sha256`; eight working files also
  match byte-for-byte. The existing Windows checkout of `workspace.css` uses
  CRLF, unlike its LF Git blob. It was left untouched; Git reports no root diff.
- The first run found a vendor checksum failure because `core.autocrlf=true`
  converted the patch checkout to CRLF. Restored the supplied vendor bytes and
  added `.gitattributes` inside this module only to preserve LF. No vendor logic
  or checksums were changed. The rerun passed all 73 tests.

## Real browser checks

Local server: `http://127.0.0.1:4203/beginner-3axis/`, explicitly bound to
`127.0.0.1` only. The preview server was left running for review.

Verified in the Codex in-app browser:

- WebGL robot renders, with three joints and visible fixture/axis labels.
- Recorded two completed movements: +10 mm Z, then Y=70 mm.
- Reset restores the program start and retains two steps.
- Playback completes at the recorded endpoint without adding steps.
- Pause holds the displayed pose stable across subsequent checks; Resume works.
- Stop interrupts playback at a partial pose; Reset then restores the start.
- Gripper closes and opens; recording OFF does not add steps.
- No console errors or warnings during these checks.
- A phone-width layout spot check was performed; this is not full responsive acceptance.

## Remaining review items

- Several scene labels overlap in the default camera view.
- Target inputs show long decimal values, which could distract beginners.
- Complete keyboard-only lesson traversal, focus trapping/restoration, 200% text
  zoom, the full requested viewport matrix, physical touch devices and all seven
  lessons in a real browser remain unverified. The seven-lesson DOM pass is not
  a substitute for those checks.
- The original root app was protected by Git/hash checks, not a new full manual
  regression run.
- The supplied module saves under its own localStorage key and exports JSON/text;
  it has no import UI. This behavior was retained from the supplied module.

Publication is a feature-branch push only. No main merge, root navigation change
or public website deployment is authorized by this integration.
