# Plan an Android song-composition workspace

Labels: wayfinder:map
Status: open

## Destination

An agreed Android-first composition design, tested with a playable touch prototype on the owner's phone, and an evidence-based choice of implementation engine, including Godot as a candidate.

## Notes

- The owner accepted the destination and starting conditions in [Mobile planning intake](../../docs/mobile-planning-intake.md): develop on the computer, test on a Redmi Note 9 with Android 12, begin with landscape writing, and adapt the browser prototype before choosing an engine. Portrait initially covers basic navigation and review.
- This is a separate effort from [Plan a playable desktop song composer](../song-composer/map.md). Preserve that prototype as the desktop reference. Mobile interaction work carries forward the existing musical rules; differences require an explicit decision.
- Use Wayfinder with the local Markdown tracker, Grill with Docs (Grilling and Domain Modeling) for human decisions, Research for outside facts, and Prototype for disposable interaction experiments. Continue the user's TDD requirement at the agreed command/inspection and playback-plan seams; touch and audio claims require device evidence.
- The map includes disposable prototypes to resolve decisions, not production implementation or publication. A browser touch trial does not by itself validate Godot, native audio latency, or Android lifecycle behavior.
- Reuse the shared [musical glossary](../../GLOSSARY.md). Keep layout preferences and engine choices in their decision tickets, rather than adding implementation details to the glossary.
- Child tickets live in `issues/`. `Blocked by` lists local ticket identities; all blockers must be resolved. Open, unclaimed, unblocked tickets form the frontier, ordered by number. Claim a ticket before working it; the owner supplies usability verdicts.
- The owner authorized a public `gnaplds/music-composer` repository on October 29, 2026. Keep research and prototypes linked from their tickets. The separate local `barry-harris/` study and unrelated files remain outside the publication scope.
- The computer's loopback preview address is not a phone-accessible URL. Establish and verify a local delivery path before asking the owner to try the phone prototype. Prior browser-inspection approval limits are not evidence of a successful mobile check.

## Decisions so far

- [Assess Godot for the Android composer](issues/02-godot-android-feasibility.md): Android export, touch, polyphony, and file APIs are documented; local export setup is incomplete, and audio scheduling, latency, and lifecycle behavior need a focused device experiment. The [research report](../../docs/research/godot-android-feasibility.md) preserves source evidence and separates it from unmeasured phone behavior. The engine choice remains open.

## Not yet specified

- Additional native feasibility experiments exposed by the initial Godot research or the browser touch trial.
- How mobile storage, recovery, lifecycle interruptions, and project exchange should adapt the existing desktop plan once an implementation approach is selected.
- How much additional device coverage is needed after the first phone trial, including smaller screens, system scaling, and other audio outputs.

## Out of scope

- Writing or building the app directly on the phone; the accepted workflow uses the computer for development.
- Shipping an APK, a store release, or a production mobile application during this planning effort.
- Choosing Godot merely because it is the first engine proposed; the choice remains a decision informed by evidence.
- A full portrait composition workspace in the initial mobile prototype, iOS/tablet-specific work, and new musical features unrelated to adapting the accepted workflow.
- Automatically generating songs or replacing the existing chord-recognition, harmony-label, or independent-part rules during this interaction study.
