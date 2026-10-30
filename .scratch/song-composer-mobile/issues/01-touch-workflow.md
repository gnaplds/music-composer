# Define the phone writing workflow

Parent: [Plan an Android song-composition workspace](../map.md)
Labels: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: owner-and-codex
Blocked by: none

## Question

How should the owner enter, select, inspect, move, resize, and delete notes on the phone without touch gestures causing accidental musical edits?

Starting conditions are accepted: landscape writing on a Redmi Note 9 with Android 12, a browser prototype first, and the existing musical rules. Decide what stays visible with the timeline and piano, where secondary controls open, and how the three parts remain clear within the available height. Define alternatives for desktop right-click and modifier-key selection; distinguish navigation from note/cursor dragging. Establish a small real musical task, the prototype feature boundary, and visible-control/device checks that can settle whether the interaction works.

## Context for the interview

Source inspection of the [desktop prototype](../../song-composer/prototype/index.html) on October 29, 2026 found:

- Notes start move/resize gestures on pointer-down. Their resize handle is at most 10 CSS pixels wide, and notes disable native touch panning. The cursor handle is 18 pixels wide.
- Note-group selection relies on Ctrl/Cmd or Shift, deletion relies on context-menu events, and drag cancellation exposes Escape. The mobile workflow needs accessible touch equivalents without changing the underlying editing rules.
- The piano renders 37 pitches in a region with a 680-pixel minimum width. The desktop workspace reserves a separate inspector column; its narrow-width rule stacks the inspector and makes the keyboard dock non-sticky. These rules do not establish a usable landscape phone workspace.

These are source observations, not measured phone behavior. Candidate interaction patterns still need the owner's decision and a device trial; no touch gesture has been accepted implicitly.

## Comments

### Resumed for the shared website

The owner requested mobile support in the current website and invoked Wayfinder and Grill with Docs. Retain the accepted landscape-first orientation, Redmi Note 9 on Android 12, and musical rules. This ticket is claimed for the live workflow interview; no touch design is accepted merely by being proposed.

First resumed round, accepted by the owner:

- Q80 accepted: compact landscape layout with transport at the top, timeline in the middle, and piano at the bottom; active part expanded by default, other parts collapsible/expandable, and secondary controls in a panel.
- Q81 accepted: normal timeline swipes pan even from notes; taps select, and explicit Move/Resize actions precede edit drags, with visible Delete.
- Q82 accepted: two visible piano octaves on phones, retaining octave-shift controls.

These answers settle the initial layout and navigation model. Remaining choices cover multiple selection, cancellation, cursor seeking, secondary panels, and the phone trial. Layout is not a new musical domain concept, so no glossary term or architecture decision is added at this stage.

### Current source check

The delegated read-only source check confirms that the shared page still uses width-only breakpoints: a 245-pixel inspector remains at viewport widths of 721–1000 CSS pixels, and there is no short-landscape layout rule. Its 37-pitch piano has a minimum width of 680 pixels. Primary pointer movement from a note starts an edit after two horizontal pixels; the explicit pan path requires the right mouse button. Note and box group selection still require modifiers. Pointer interruption already cancels a drag, but there is no visible Cancel action. The existing Delete control is hidden when a note group is selected. These are code facts, not measurements on the phone.

Second resumed round, accepted by the owner:

- Q83 accepted: explicit Notes/Boxes selection mode; taps toggle membership, swipes pan, count/Clear controls, and note selection survives part switching.
- Q84 accepted: Move or Resize arms one drag; release commits one Undo step and returns to navigation, while Cancel/interrupted touch rejects the preview.
- Q85 accepted: tap beat marks or empty rows to seek, or drag a larger orange cursor handle with existing snapping; seeking pauses playback, while tapping notes only selects them.
- Q86 accepted: secondary settings and harmony details in a scrollable Tools overlay with Close; preserve selection and editing position on dismissal.

No interface code has changed during this interview. The remaining trial must check actual landscape height, touch precision, scrolling/editing conflicts, keyboard entry, and audio on the owner's phone.

Final interview round, accepted by the owner:

- Q87 accepted: Delete removes every selected note as one undoable action, displays the selection count, and does not attach deletion to swipes or long presses. Box selection does not gain a delete action.
- Q88 accepted: confirm the build agreement and a Redmi trial covering held bass, chord entry, advancing melody, safe scrolling, selection and move/resize, selected-box key changes, and playback. Also check that rotation preserves current state and desktop controls still work. Portrait remains navigation/review for the first version.

The existing command/inspection and playback-plan test seams carry forward. Visible browser controls and physical-device trials remain separate evidence; automated musical tests do not prove touch comfort or Android audio behavior.

## Answer

The owner accepted Q80–Q88 and explicitly authorized building and testing the shared-site workflow. Use the compact landscape arrangement, two-octave piano, swipe-first navigation, explicit selection/edit/delete actions, larger cursor control, and Tools overlay recorded in the accepted rounds above. Musical rules and test seams remain unchanged except for atomic deletion of a selected note group.

This resolves the workflow decision, not usability on the phone. Continue in [Test the composition workflow on the phone](03-phone-touch-prototype.md); its owner trial supplies that verdict. No engine choice or production persistence is implied.


## Current orientation — October 30, 2026

The owner accepted portrait as the primary writing orientation, replacing the earlier Q77/Q80/Q82 portrait restriction. Portrait has a one-octave piano with 160-pixel default key height and octave controls; landscape retains two octaves. Part and duration remain above the piano, with transport and Tools at the top. Both orientations support the same selection, movement, resizing, deletion, and playback. Existing row-collapse and piano-height controls remain. See the [portrait trial](03-phone-touch-prototype.md#portrait-writing-trial--october-30-2026) for browser evidence and the pending physical-phone verdict.
