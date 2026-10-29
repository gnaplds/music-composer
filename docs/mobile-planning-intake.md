# Android composition workspace: planning intake

Started October 29, 2026. This is a new mobile effort alongside the existing [desktop plan](../.scratch/song-composer/map.md).

## Accepted destination

Q75: agree on an Android-first mobile design, test it with a playable touch prototype on the owner's phone, and decide whether Godot is suitable for the implementation. Godot is a candidate, not a chosen engine. Carry forward the agreed musical rules while testing the mobile interaction separately.

Q76: develop on the computer and test on the Android phone. Development directly on the phone is outside this effort.

## Existing reference

The [desktop prototype](../.scratch/song-composer/prototype/README.md) is the current behavior reference. Preserve it while planning mobile. Its 43 command/inspection and playback-plan tests cover musical behavior, not mobile usability, touch gestures, or Android audio performance.

Use the existing [glossary](../GLOSSARY.md) for musical terms. Mobile layout does not change the meanings of a note, part, chord box, key, collection, harmony span, or note selection. No engine ADR is justified before the trade-off is examined and a choice is accepted.

## Accepted starting conditions

- Q77: landscape is the primary writing orientation. Portrait initially supports basic navigation and review; a full portrait composition workspace comes later.
- Q78: adapt the existing browser prototype for the first touch trial, reusing its tested musical logic. This does not choose web technology for the final Android app.
- Q79: the first test device is the owner's Xiaomi Redmi Note 9 running Android 12. These details are owner-reported; physical-device behavior has not been verified.

The [mobile planning map](../.scratch/song-composer-mobile/map.md) indexes the decision tickets. Open layout and gesture decisions live there, not as an implied agreement in this intake.

## Areas to investigate

- Touch alternatives for right-click deletion and modifier-key selection; conflicts between scrolling, note movement, resizing, and cursor movement.
- The amount of timeline, part information, harmonic analysis, and keyboard visible at once.
- Godot's Android UI, touch input, audio timing, project/file handling, testing, and deployment capabilities, including limits requiring physical-device evidence.
- How to reach the prototype on the phone. The current loopback URL on the computer is not a phone-accessible address.
- The device trial and pass criteria needed before choosing an engine or expanding the mobile build.

## Standing constraints

Use Wayfinder with the established local Markdown tracker, Grill with Docs for decisions, and TDD at the agreed public behavior seams when implementation begins. The user's earlier TDD instruction continues to override the Prototype skill's default of skipping tests. Browser source/model checks cannot establish touch comfort or device latency.

Keep prototypes disposable. Current scratch state is in memory, and reloading loses it. Saving, file transfer, and Android lifecycle behavior need explicit mobile planning rather than an assumption that the existing browser-storage plan transfers unchanged.
