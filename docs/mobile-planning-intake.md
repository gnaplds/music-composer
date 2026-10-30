# Android composition workspace: planning intake

Started October 29, 2026. This is a new mobile effort alongside the existing [desktop plan](../.scratch/song-composer/map.md).

## Accepted destination

Q75: agree on an Android-first mobile design, test it with a playable touch prototype on the owner's phone, and decide whether Godot is suitable for the implementation. Godot is a candidate, not a chosen engine. Carry forward the agreed musical rules while testing the mobile interaction separately.

Q76: develop on the computer and test on the Android phone. Development directly on the phone is outside this effort.

## Existing reference

The [desktop prototype](../.scratch/song-composer/prototype/README.md) is the current behavior reference. Preserve its desktop behavior while adding the phone layout to the same website. Its 45 command/inspection and playback-plan tests cover musical behavior, not mobile usability, touch gestures, or Android audio performance.

Use the existing [glossary](../GLOSSARY.md) for musical terms. Mobile layout does not change the meanings of a note, part, chord box, key, collection, harmony span, or note selection. No engine ADR is justified before the trade-off is examined and a choice is accepted.

## Accepted starting conditions

- Q77: landscape is the primary writing orientation. Portrait initially supports basic navigation and review; a full portrait composition workspace comes later.
- Q78: adapt the existing browser prototype for the first touch trial, reusing its tested musical logic. This does not choose web technology for the final Android app.
- Q79: the first test device is the owner's Xiaomi Redmi Note 9 running Android 12. These details are owner-reported; physical-device behavior has not been verified.

The [mobile planning map](../.scratch/song-composer-mobile/map.md) indexes the decision tickets. Open layout and gesture decisions live there, not as an implied agreement in this intake.

## Current direction: the same website

The owner has resumed the mobile effort and explicitly requested that the current website work when opened on a phone. The current build adapts the existing page and musical logic for touch and phone dimensions. It will not require a separate mobile site or a Godot build for this trial. Godot remains a later candidate under the existing engine decision, rather than a prerequisite for this work.

The Redmi Note 9 test device and musical rules carry forward. On October 30, 2026, the owner replaced the initial landscape preference with [portrait writing](../.scratch/song-composer-mobile/issues/01-touch-workflow.md#current-orientation--october-30-2026): one octave with taller keys, while landscape retains two octaves. The owner accepted Q80–Q88 in [Define the phone writing workflow](../.scratch/song-composer-mobile/issues/01-touch-workflow.md). Opening the same site on a phone is not proof that the current desktop gestures work with touch; the owner's physical-device trial remains necessary.

## Areas to investigate

- Touch alternatives for right-click deletion and modifier-key selection; conflicts between scrolling, note movement, resizing, and cursor movement.
- The amount of timeline, part information, harmonic analysis, and keyboard visible at once.
- Godot's Android UI, touch input, audio timing, project/file handling, testing, and deployment capabilities, including limits requiring physical-device evidence.
- Phone delivery uses the owner-provided site, https://simplecomposer.netlify.app/. The computer loopback URL remains local only.
- The device trial and pass criteria needed before choosing an engine or expanding the mobile build.

## Standing constraints

Use Wayfinder with the established local Markdown tracker, Grill with Docs for decisions, and TDD at the agreed public behavior seams when implementation begins. The user's earlier TDD instruction continues to override the Prototype skill's default of skipping tests. Browser source/model checks cannot establish touch comfort or device latency.

Keep prototypes disposable. Current scratch state is in memory, and reloading loses it. Saving, file transfer, and Android lifecycle behavior need explicit mobile planning rather than an assumption that the existing browser-storage plan transfers unchanged.
