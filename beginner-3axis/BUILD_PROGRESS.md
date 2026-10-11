# Build and verification record

Review build prepared 11 October 2026. Baseline: `25a1cd43c393ad16fa570529efe4ee97daf62035`. Feature branch: `feat/three-axis-learning-lab`.

## Scope and baseline

All new files are isolated in `beginner-3axis/`. The checkout initially had no local edits, AGENTS.md, editable source tree, package manifest or test suite. The original nine files are protected by `baseline.sha256`; every final hash matches. Root README test claims were not substituted for executed tests. No root navigation change, merge or deployment was performed.

The user separately authorized pushing this feature branch and a draft review PR. Publication is not permission to merge or deploy.

## Gates

| Gate | Result | Evidence |
|---|---|---|
| Phase 0 audit/protection | PASS | Clean baseline, actual file audit, saved hashes; no original edits |
| Original browser baseline | NOT RUN | Supported cloud browser could not reach the attempted local HTTP server; the managed browser also cannot create WebGL2 |
| Phase 1 pure model | PASS | Independent FK/IK fixtures, frame/link lengths, negative inputs, 200 admissible seeded poses, continuity and geometry helpers |
| Phase 2 planner/grasp | PASS | Complete 9-action routes to A and B, full swept-envelope checks, direct obstacle rejection, link/held-object/thin-sweep fixtures, atomic errors, provenance and unsupported-release checks |
| Phase 3 numeric rendering | PASS | Nine actual Three.js scene-graph tests: world landmarks, proxy geometry, three joints, fixed tool frame, dimensions, camera/state separation, fallback and disposal |
| Phase 3 visual rendering | NOT RUN | No WebGL2-enabled supported browser preview available |
| Phase 4 controller | PASS (automated) | Fake elapsed-time tests for recording latch, locking, pause/resume, cancellation, start matching, no-ops, edits, reset, approach-first recording |
| Phase 4 real-browser flow | NOT RUN | Environment limitation; jsdom is not a browser substitute |
| Phase 5 lessons/coach/storage | PASS (automated) | Evidence predicates, real-controller Lesson 5, transfer replay, bilingual parity, safe restore, corruption/quota, exports |
| Phase 5 integrated DOM journey | PASS | Actual page handlers exercised all seven lessons, direct rejection, no-hint B program/replay, exports, reload/reset and fresh IDs |
| Phase 6 browser/mobile/accessibility | NOT RUN | Outstanding manual/browser acceptance listed below |
| Original-file/static regression | PASS | Nine hashes unchanged; syntax and local dependency checksum checks pass; legacy storage sentinel preserved by DOM flow |

## Commands actually executed

From repository root:

- `node --test beginner-3axis/tests/*.test.mjs` — **73 passed, 0 failed**, after final implementation edits.
- `for f in beginner-3axis/*.mjs; do node --check "$f" || exit; done` — PASS.
- `sha256sum -c beginner-3axis/baseline.sha256` — all nine OK.
- `BNTA_JSDOM_PATH=/tmp/bnta-dom-test/node_modules/jsdom/lib/api.js node beginner-3axis/tests/ui.dom.mjs` — PASS for the integrated seven-lesson DOM journey. The path selects the explicitly installed jsdom@26.1.0; standard reproducible setup is `npm ci --ignore-scripts` then `npm run test:dom` from the new folder.
- `npm exec --cache /tmp/bnta-npm-cache --yes --package prettier@3.6.2 -- prettier --write '*.mjs' 'tests/*.mjs' index.html styles.css package.json` from the new folder — source formatting only, excluding original files and vendor distributions.

Node version: v24.19.0. Pure test RNG seed: 20261011, 200 admissible poses tested, 28 inadmissible generated candidates explicitly skipped before reaching that count.

Actual deterministic end errors with obstacle enabled:

- Destination A: part position error `2.842170943040401e-14 mm`; forward alignment error `1.6653345369377348e-16 rad`; final TCP error `2.0097183471152322e-14 mm`.
- Destination B: part position error `3.4809342861069267e-14 mm`; forward alignment error `0 rad`; final TCP error `2.0097183471152322e-14 mm`.
- Both routes record exactly 9 successful actions. Replay does not add steps. Seven movement legs use A sample counts `[129,65,76,349,119,65,65]`; B `[129,65,76,513,119,65,65]`.

## Browser limitation and outstanding acceptance

Attempted server: `python -m http.server 8765 --bind 0.0.0.0` in the repository. The execution session remained open without output, but shell curl and the supported cloud browser both returned connection refused. Direct installed Chromium could not launch because the execution sandbox rejects its Unix socket. An approved elevated attempt had the same failure; no alternate flags or bypasses were used. Separate supported-browser inspection confirmed WebGL2 is unavailable in the managed browser.

No real viewport or device checks are claimed. Still required in a reachable WebGL2 browser:

- 360×800, 390×844, 844×390, 768×1024, 1366×768 and 200% text zoom.
- Actual target-size measurement, horizontal overflow and occlusion checks.
- Keyboard-only complete task, real focus trap/Escape/restoration, and touch emulation or real-device usability.
- 3D appearance, camera orbit and resize, readable anatomy labels, mesh/render alignment on screen.
- Full recorded/replayed learner flow at each viewport, final object tolerance and no new browser errors.
- Original root application's observed learning, movement, recording, reset and language flows.
- HTTP load at both a direct entry and repository subpath, and runtime network-request inspection.

The CSS declares minimum 44px controls, responsive single/two-column layouts and reserved playback space; this is source evidence, not measured browser acceptance. Native dialog labels and DOM state are tested, not complete accessibility certification. No FPS or physical-device metric was invented.

## Corrections made during review

- Gripper steps link to the actual GRIPPER_CHANGED evidence, allowing genuine Lesson 5 completion.
- Saved approach provenance includes finite samples, start/end joints, matching scene geometry and object state; malformed evidence rejects structurally rather than throwing.
- Deleting the final step clears the obsolete start snapshot; empty programs remain saveable.
- Restore rejects floor penetration, inconsistent held/open/support state, oversized local offsets, mismatched reconstructed object transforms, unsupported completion statuses and stale expected ends.
- Reload seeds new evidence IDs and restores the correct lesson/transfer reset scene.
- Record state is latched at action acceptance; interrupted partial recordings cannot silently append.
- Run preflights the actual compatible start, avoiding tolerance-related first-frame teleport.
- Joint demo uses a checked joint-linear path without recording or hidden Cartesian compensation.
- The independent transfer clears old coaching and requires an actual changed-program replay at B.
- Teaching definitions/trade-offs, sensor caveats, joint changes and the post-replay six-axis comparison are visible, separate from answer scoring.
- All owned source was consistently formatted; vendor files remain unmodified and checksum-verified.

## Model limits

Educational three-axis model only. Fixed tool orientation follows the arm. Virtual support fixtures; no gravity/free dropping, calibrated dynamics, forces, payload, friction or hardware safety system. Conservative capsule/sphere and expanded-box geometry may over-reject corners. Intended mechanical connections and identified finger/held-part contacts are documented in README. Browser/classroom acceptance is incomplete.

Next action after review: run the outstanding browser acceptance in a WebGL2-capable environment. Merge, root-navigation integration and live deployment require separate approval.

## Publication result

The verified feature branch is committed locally. Shell `git push -u origin feat/three-axis-learning-lab` failed because HTTPS GitHub credentials are unavailable. The connected GitHub integration then rejected the first blob publication with HTTP 403, `Resource not accessible by integration`. No remote branch or pull request was created. Further remote mutations stopped at that permission boundary. A write-authorized connection or an authenticated checkout is required to finish publication; no merge or deployment was attempted.
