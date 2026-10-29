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

Use the owner's existing Netlify site: https://simplecomposer.netlify.app/. Turn the Redmi Note 9 sideways and try the accepted Q88 task: held bass, chord, advancing melody; pan from a note; select/move/resize/delete a group and Undo; change the key of separated boxes; play and rotate. Report any missed taps, accidental edits, hidden controls, or audio trouble.

Keep this ticket claimed until the owner reports the physical-device result. The engine decision remains open. No mobile usability verdict or Godot choice has been recorded.
