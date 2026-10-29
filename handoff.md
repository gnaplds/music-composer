# Simple Composer handoff

Updated October 30, 2026. Read this first, then follow the linked records for details. This file lives in the repository at the owner's explicit request, overriding the Handoff skill's temporary-directory default.

## Current product

Simple Composer is one responsive browser app, published at [simplecomposer.netlify.app](https://simplecomposer.netlify.app/). Desktop and phone share the same composition model and source. There is no separate Android app or Godot implementation. It remains an interaction prototype, not the completed first release.

Desktop supports piano step entry, independent Melody/Chord/Bass parts, a timeline of chord boxes, harmony and Roman-numeral displays, editing, and playback. The phone view adapts that workflow for landscape writing, with a two-octave piano and explicit touch selection, Move, and Resize actions. Portrait supports review and navigation. See the [prototype guide](.scratch/song-composer/prototype/README.md) for the exact behavior and limits; do not reconstruct the rules from conversation fragments.

**Composition state exists only in memory.** Reloading, closing, or discarding the browser tab loses notes. Rotation is designed to preserve state. Local saving, portable project files, MIDI export, the complete voicing tools, and the final piano sound are planned work, not shipped features.

## Latest work and evidence

- The current update adds a draggable piano-height handle, a global Hide parts / Show parts button, key labels off by default, and wider orange cursor handles. The owner confirmed the desktop/phone behavior and session-only preferences. See the [workspace revision](.scratch/song-composer/issues/06-desktop-workspace.md#fourteenth-revision-adjustable-piano-and-compact-timeline).
- All 45 musical tests pass. Browser checks cover resizing, limits, hiding/restoring rows, playback with hidden rows, musical undo, portrait rotation, and short landscape layout. The composer core is unchanged. The prototype guide records current controls; the root README lists features only.
- The owner has not supplied a physical-phone trial verdict. Mouse interaction at resized desktop viewports does not establish touch comfort, Android audio latency, or interruption recovery. Keep the phone trial ticket claimed until that evidence arrives. Multi-pointer and Escape cancellation during a resize still need a manual trial.

## Where to work

| Need | Source of truth |
| --- | --- |
| App source | [.scratch/song-composer/prototype/index.html](.scratch/song-composer/prototype/index.html) — self-contained HTML, CSS, and JavaScript |
| Automated checks | [composer.test.cjs](.scratch/song-composer/prototype/composer.test.cjs) |
| Local run, test, and deployment commands | [Prototype guide](.scratch/song-composer/prototype/README.md#run-locally) and [netlify.toml](netlify.toml) |
| Accepted musical terms | [GLOSSARY.md](GLOSSARY.md) |
| Desktop plan and decisions | [Desktop map](.scratch/song-composer/map.md), [planning intake](docs/planning-intake.md), and [ADRs](docs/adr) |
| Accepted phone controls | [Touch workflow](.scratch/song-composer-mobile/issues/01-touch-workflow.md) |
| Mobile plan and current evidence | [Mobile map](.scratch/song-composer-mobile/map.md), [intake](docs/mobile-planning-intake.md), and [phone trial](.scratch/song-composer-mobile/issues/03-phone-touch-prototype.md) |
| Godot evidence and open decision | [Feasibility study](docs/research/godot-android-feasibility.md) and [engine-choice ticket](.scratch/song-composer-mobile/issues/04-mobile-engine-choice.md) |

## What to do next

1. **Collect the owner's phone result.** Use the existing live site on the agreed Redmi Note 9 / Android 12, in landscape. The [pending trial](.scratch/song-composer-mobile/issues/03-phone-touch-prototype.md#owner-trial--pending) defines the task. Ask for concrete missed taps, accidental edits, hidden controls, and audio problems. Do not ask the owner to approve usability before trying it.
2. **Fix observed problems in the same website.** Preserve the desktop workflow and accepted musical rules. Continue TDD for behavior changes; use visible browser checks for layout and gesture integration, then a phone retest for device-specific claims. Record the result in the trial ticket.
3. **Decide the mobile implementation after the trial.** Godot remains a candidate. Use the [engine-choice ticket](.scratch/song-composer-mobile/issues/04-mobile-engine-choice.md); if audio timing or lifecycle evidence is missing, propose a small device experiment rather than starting a port. Record an accepted architecture trade-off in an ADR when warranted.
4. **Resume release planning once the workflow is accepted.** The desktop [implementation approach](.scratch/song-composer/issues/07-implementation-approach.md) and [release specification](.scratch/song-composer/issues/08-release-specification.md) remain open. Recovery and saving should be addressed before relying on this for real compositions. The existing [recovery decision](.scratch/song-composer/issues/05-project-recovery.md) defines the agreed baseline; it does not mean storage is implemented.

## Working agreements

- Keep changes small and use the existing model and controls. Do not add a framework, separate mobile site, account system, or native packaging without an actual need and an agreed scope.
- Musical edits are checked through public editing commands and inspectable state; playback through timed-note plans. UI checks and listening cover different evidence. Tests cannot prove musical comfort or hardware latency.
- The owner chose same-site implementation and TDD. These override the Prototype skill's defaults about separate throwaway branches, multiple variants, and skipping tests. Do not reopen accepted Q80–Q88 without a concrete problem.
- Planning uses local Markdown tickets. Follow their blockers, claim work before starting, and leave usability and engine choices to the owner. Avoid duplicating decisions across new documents.
- The existing public GitHub repository and Netlify production workflow are authorized. Check Git status first, stage only intended files, and verify deployment after pushing. Keep `barry-harris/`, credentials, local tooling, and ignored build output out of publication. A loopback preview address cannot be opened from the phone.
- Write clear, direct prose. Challenge assumptions with evidence. Ask only for missing choices; carry out already authorized work without repeated confirmation.

## Suggested skills

Call these skills when their next task applies, using the Skill tool if available or reading their `SKILL.md` files:

- **Wayfinder** — continue the existing planning maps and ticket order.
- **Grill with Docs** — interview the owner for unresolved product or engine decisions; it invokes **Grilling** and **Domain Modeling**. No new interview was needed for the badge removal.
- **TDD** — implement new musical or editing behavior through the agreed test seams.
- **Diagnosing Bugs** — investigate a reported phone or desktop failure before changing behavior.
- **Prototype** — run a focused interaction or engine experiment within the owner's overrides above.
- **Ponytail, full** — keep the solution minimal but complete; report unchecked behavior and material risks.

These skills are in the local agent skill catalog. Handoff files summarize the state; linked specs, tickets, tests, and commits hold the detail.
