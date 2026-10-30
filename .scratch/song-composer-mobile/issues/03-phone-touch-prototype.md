# Test the composition workflow on the phone

Parent: [Plan an Android song-composition workspace](../map.md)
Labels: wayfinder:prototype
Type: prototype
Status: claimed
Assignee: owner-and-codex
Blocked by: 01

## Question

Depends on [Define the phone writing workflow](01-touch-workflow.md).

Can the owner comfortably write and correct a short phrase on the Redmi Note 9 using the agreed touch controls while retaining the independent parts, chord boxes, harmony displays, and piano preview?

Adapt the current browser prototype in the same website after the gesture and workspace agreement. Use responsive layout and touch controls while preserving usable desktop behavior. A separate mobile URL or Godot build is not required for this trial. Test the accepted note-entry and correction task, sustained notes, selection, movement/resizing, navigation, and playback. Confirm a working phone-accessible delivery path before requesting a trial. Surface state and keep the artifact disposable; use the existing TDD seams for musical behavior and actual phone interaction for the usability verdict. Record what was observed, what remains untested, and the owner's reaction.

## Comments

The owner accepted the shared-site build agreement in Q88 after the workflow interview. Build the agreed touch interaction in the existing single-page prototype and retain desktop controls. Use TDD for atomic group deletion at the existing command/inspection seam. Reuse the tested group move/resize and playback plans. Native pointer/layout integration must be checked through actual visible controls and the owner’s phone; do not replace that with a mocked DOM test.

The user’s explicit same-site build and TDD instructions take precedence over the Prototype skill’s defaults of isolated throwaway branches, multiple visual variants, and skipped tests. Keep the in-memory limitation in Help.

## Implementation and verification — October 30, 2026

The responsive workflow is implemented in the [same app page](../../song-composer/prototype/index.html). The desktop controls are moved into the phone workspace or Tools dialog, so both layouts use the same composition and handlers. Rotation changes the layout without reloading. No dependency, new storage layer, or separate mobile site was added.

Two group-deletion tests failed before implementation and pass afterward. All 45 command/inspection and playback-plan tests pass. Both inline scripts compile, element IDs are unique, literal element references resolve, and `git diff --check` passes. Group movement, resizing, collision rejection, and selected-box key changes reuse the existing tested commands.

Visible browser observations:

- Piano entry created a held bass, a half-note chord, and an advancing melody. The phone piano exposes two octaves and retains octave shifting.
- A drag starting on a note panned the view without changing its notes or cursor. Select → Notes toggled two notes without seeking. A shared move preserved their spacing; a shared resize changed both lengths. Delete and one Undo restored the group. Cancel left the written notes unchanged.
- An invalid resize showed an error, left the note unchanged, and exited the edit mode. Cursor dragging moved the entry position with snapping and changed silent piano highlights.
- Selecting separated boxes and applying F major changed only those boxes; the gap and following box remained C major. Tools closed without changing position.
- Playback started, highlighted the current box, and cleared box selection. Dark mode and piano-name toggles worked from Tools.
- At 844 × 390 CSS pixels the piano ends at the viewport bottom. A short 844 × 320 view exposed notes hidden by the ruler; adjusted spacing, hidden native scrollbars, and selected-note visibility fixed the observed clipping. Select is in the top bar and the action row uses space only when needed. At 390 × 844, portrait hides the piano and shows the review notice; rotating back preserved notes and selection.
- Returning to 1280 × 800 restored the desktop toolbar, entry controls, inspector, and 37-key range. Desktop left-drag movement, right-click deletion, and Undo passed. The final interaction check recorded no console warnings or errors.

[Mobile landscape screenshot](../../song-composer/prototype/evidence/mobile-landscape.png). These are desktop-browser observations using mouse pointers and viewport resizing, not Android hardware tests. Real finger gestures, multi-finger/pointer interruption, speaker output, latency, and browser lifecycle recovery remain unverified. Browser reload still loses scratch notes.

## Delivery

The owner supplied https://simplecomposer.netlify.app/. Commit `b5aa831` was pushed to `master`; Netlify then picked up the update automatically. The hosted page exposes the responsive Tools and selection controls. At an 844 × 390 browser viewport it uses the phone layout and 25-key range; piano entry and Tools were exercised without console errors. The Netlify badge was found covering piano keys and initially hidden in the phone workspace. At the owner's later request, the same rule now covers desktop too. No Netlify sign-in or manual upload is needed for the trial.

## Owner trial — pending

Use the owner's existing Netlify site: https://simplecomposer.netlify.app/. Hold the Redmi Note 9 in portrait and try the accepted writing task: held bass, chord, advancing melody; pan from a note; select/move/resize/delete a group and Undo; change the key of separated boxes; play and rotate. Report any missed taps, accidental edits, hidden controls, or audio trouble.

Also try octave switching and piano-height adjustment, then rotate to landscape and back. Keep this ticket claimed until the owner reports the physical-device result. The engine decision remains open. No mobile usability verdict or Godot choice has been recorded.


## Portrait writing trial — October 30, 2026

Status: implemented and browser-checked; owner trial pending.

The owner accepted portrait as the primary mobile writing layout: a one-octave piano with octave switching and adjustable height, Part and Note duration directly above it, transport and Tools at the top, and the timeline in the remaining space. The active part starts expanded; individual collapse controls and Show/Hide parts remain. All existing selection and editing actions work in portrait. Landscape remains available with two octaves. This replaces the earlier portrait-review-only restriction and keeps the same-site implementation. The separately requested [empty-box key default](../../song-composer/issues/03-musical-context.md#empty-box-key-defaults--october-30-2026) applies on desktop and phones.

Before implementation, a 390 × 844 browser check confirmed the piano and Select control were hidden, and the keyboard still contained 25 pitches. Source inspection also found a portrait guard blocking move/resize gestures. The checks below exercise the visible controls, note editing, scrolling, resizing, rotation, and retained desktop behavior.


### Portrait browser evidence

At 390 × 844, the piano exposes 13 pitches (one octave plus its upper tonic), starts 160 pixels tall, and gives each white key 46.75 pixels of width. The timeline retains about 495 pixels before the selection row appears. The header, Part, duration, pitch range, and octave controls fit without horizontal page overflow.

Visible-control checks passed for independent bass/chord/melody entry, automatic melody advance, two-note selection, group Move, group Resize, Delete/Undo, panning from a note without editing it, cursor dragging, and piano-height adjustment. A 40-pixel upward resize changed the piano from 160 to 200 pixels. Rotation to 844 × 390 exposed 25 pitches and constrained the piano height; returning to portrait restored 13 pitches and the chosen 200-pixel height without changing the notes. The 1280 × 800 desktop layout restored its 37 pitches and controls. At the highest portrait octave, rotation kept all pitches within the existing C9 limit.

At 320 × 568, the 160-pixel piano and controls still fit, each white key is 38 pixels wide, and the timeline retains about 219 pixels. This establishes layout fit, not finger comfort. Portrait playback highlighted the current F-minor chord box. The new key default was checked through Tools and Next step: an occupied C-major box stayed unchanged, the empty next box became F minor, and entering F–A♭–C displayed Fm and i. No console warnings or errors were recorded.

[Portrait trial screenshot](../../song-composer/prototype/evidence/mobile-portrait.png). All 49 command/inspection and playback-plan tests pass, including four inheritance regressions. Checks use resized desktop browsers and mouse pointers, not physical Android touch/audio. The owner must still assess tap accuracy, scrolling comfort, interruption handling, and audio on the Redmi.

## Mobile readability update — October 30, 2026

The owner confirmed that Hide piano controls should hide the entire area above the keys: Part, Note duration, octave buttons, and pitch range. Controls start visible; the keys, resize handle, and Show piano controls remain available. Settings and notes are retained, and the toggle does not enter musical undo.

Implemented taller chord boxes (96 pixels, or 80 in short landscape), 24-pixel chord names, 20-pixel Roman numerals, 16-pixel main text, and 14-pixel supporting labels. Play and Undo have an 80-pixel minimum width and a 12-pixel gap. Volume sliders use the available row width. The phone cursor handle now sits on the measure ruler to leave chord names clear.

All 49 existing model/playback tests pass; both inline scripts parse. Browser testing was blocked because local browser use is disabled in Work settings. No new screenshot or visual usability result is claimed. Check portrait at 390 × 844 and 320 × 568, landscape at 844 × 390 and 844 × 320, and desktop restoration. Verify hiding/showing controls preserves notes, settings, and undo; piano resizing; cursor dragging and keyboard seeking; slider reach; Play/Undo spacing; and text clipping. The physical Redmi trial remains pending.

## Larger controls and beginner help — October 30, 2026

The owner requested another size increase and shorter help for ESL and first-time users. Mobile chord boxes now use 116 pixels (96 in short landscape), chord names use 28 pixels, and Roman numerals use 22 pixels. Undo, Select, and Tools use equal 80-pixel widths. Play uses 96 pixels on phones and a 112-pixel minimum on desktop. In portrait, Help sits beside the title; the other controls use one row, or two rows below 388 pixels.

The Help panel starts with six short steps. Other topics are collapsed. Examples, the note list, and the warning about unsaved notes remain. Space uses the existing Play/Pause action outside controls; held or modified Space does not repeat the shortcut. Input fields, editable text, focused buttons, and Help/Tools keep their normal keyboard behavior.

All 49 musical tests pass. Inline scripts parse, all existing HTML IDs remain, and the text passed Simple English sentence checks. Browser use is still disabled in Work settings. Pending checks include narrow portrait wrapping, desktop Play width, Space start/pause/resume, held Space, input/button focus, and all tutorial steps. Physical-phone testing remains pending.

## Box-based note selection and layout fixes — October 30, 2026

The owner confirmed that a mobile box tap selects every note that sounds anywhere in its span, across all three parts. Held notes count. Edits affect each complete note, including portions outside the box. Clear only removes the selection. More box taps add notes without duplicates in note selection mode. Select → Boxes stays available for key changes.

Implemented this behavior through the existing note-group actions. Space now plays/pauses with a focused chord box. Select/Tools text is centered. Clear, Move, Resize, and Delete use the header controls' 44-pixel height and 12-pixel spacing. The Tools entry section uses separate grid rows, and Zoom has its own row. Desktop chord boxes are 120 pixels tall with 28-pixel names; mobile boxes are 140 pixels with 32-pixel names (116-pixel boxes in short landscape). Labels scroll away at viewport heights of 650 pixels or less so they cannot cover the full note area.

Before the fix, browser measurements showed Position and Snap labels shrinking to about 6 pixels wide, and Space left playback stopped after box selection. After the fix, field bounds did not overlap, Space started/paused, and Space in a text field kept typing. Browser checks also passed for box selection of held notes, combined note selections without duplicates, individual note taps across parts, Clear without deletion, group Move/Resize/Delete, Undo, and separate box selection for keys. Measured mobile action heights were 44 pixels with 12-pixel gaps. Desktop restored its 120-pixel boxes and 28-pixel names. Screenshots: [note selection](../../song-composer/prototype/evidence/mobile-box-selection.png), [Tools](../../song-composer/prototype/evidence/mobile-tools-arranged.png).

All 51 model/playback tests pass, including two new tests for box boundaries, held notes, detached inspection results, and group Delete/Undo. No console errors or warnings appeared in the final capture session. The browser's reported CSS viewport differed from requested sizes; claims use measured dimensions. A 320 × 568 inspection confirmed scrolling labels, but browser access became disabled before the final scroll gesture. That gesture and physical Redmi touch/audio checks remain pending.
