# Define project recovery and file exchange

Parent: [Plan a playable desktop song composer](../map.md)
Labels: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: owner-and-codex
Blocked by: 04

## Question

What saving, recovery, and file-exchange behavior makes the agreed offline writing session dependable and useful?

Decide project creation, naming, duplication, deletion and recovery; autosave and visible save status; undo/redo expectations; a portable project backup/restore format; and whether MIDI export, MIDI import, audio export, or external MIDI input is needed in the first release. Consider browser storage failure and clearing site data. Separate true offline reopening of the application from merely storing the project's notes locally.

## Answer

Resolved with the owner on October 28, 2026, through Q36–Q42. These are the first version's saving, recovery, and exchange rules. The [browser report](../../../docs/research/browser-audio-offline.md) and [MIDI report](../../../docs/research/midi-file-exchange.md) provide the technical evidence; neither reports a tested application.

### Local saving and project management

- Store projects locally in the current browser on the current computer. Autosave after completed edits and display Saving, Saved locally, or a clear save error. Saved locally means the current state has been written successfully; it does not mean a separate backup exists.
- The first version has no app account or cloud project sync. This does not settle any access requirements of the eventual hosting platform. Moving work to another browser or computer uses a project file.
- The project list supports Create, Rename, Duplicate, Move to Trash, and Restore. A duplicate is an independent project copy.
- Keep trashed projects until the owner explicitly deletes them permanently. Confirm before permanent deletion; do not purge them automatically. Trash is part of the same local storage, so it does not protect against clearing browser data.
- Undo/redo covers musical edits in the current open-project editing session. Reopening restores the latest saved state with a fresh undo history. Duplicate preserves alternate arrangements deliberately; automatic version history and undo across reopening are deferred. Trash/Restore handles project removal separately from musical undo.

### Full project files

- Allow downloading a full project file and importing it as a new project copy. Import does not overwrite the current project or an existing project with the same name.
- Preserve the project name, notes and their part assignments, registered pitches, exact musical starts and durations, box boundaries, song extent including empty measures, tempo, initial context and later key/meter/collection markers, and chosen/custom labels with their scopes and review state. Preserve the relationships needed to reconstruct the composition, including sustained notes and short measures.
- The file contains the current composition state, including edits that have not yet saved locally. It is a composition backup, not a recording of the piano sound or a copy of session undo history. A downloaded file remains a snapshot; later autosaves do not update it.
- Restore with a distinct project identity while preserving the composition's internal relationships. Original and restored copies can then be edited independently.
- Browser-local storage alone cannot recover a project after that storage is cleared. A downloaded project file provides a separate recovery path if the owner has kept it elsewhere. The [local-storage ADR](../../../docs/adr/0003-local-projects-and-portable-backups.md) records this trade-off.

### MIDI exchange

- Export the whole song as a Standard MIDI File with separate named Bass, Chord, and Melody tracks. Use a distinct MIDI channel for each part. Include note events, the song-wide quarter-note tempo, and timed key/time-signature changes. A metadata track may accompany the three musical tracks.
- Preserve written note starts and releases, including sustains across box and measure boundaries. Export does not move notes when key or meter changes. Choose a tick resolution that represents all supported rhythmic positions exactly; encode tempo within the format's integer precision. Do not silently quantize, clamp, shorten, or merge notes to make an export fit.
- Use the full project file to preserve chord boxes, selected/custom labels, and harmonic collections. The first version does not promise to carry these app-specific meanings through other software in MIDI metadata. MIDI describes musical events; the receiving instrument determines their sound.
- Q70 later prevents new same-pitch overlaps within one part during editing. Existing or restored projects still need the following export check; this is not permission to discard their notes. Detect overlapping notes of the same pitch within one part. Show their affected positions and explain that other software may handle their releases differently. The owner may proceed with the written note events unchanged after that warning. Export never changes the source project.
- Separate channels distinguish equal pitches in different parts when the receiver preserves those channels. They do not remove the ambiguity within a part or guarantee how every editor will import the file.
- Defer selected-passage MIDI export, MIDI import, audio-file export, and external MIDI keyboard input. Importing this app's full project files remains included.

### Required implementation safeguards

These safeguards follow from the accepted recovery requirements; they are not extra version-history or cloud features.

- Only report Saved locally after a successful write. A failed write must retain the current edits in memory, keep the last valid saved state intact, and leave a visible failure status. Offer a project-file download of the current state and a retry path. Do not silently discard unsaved work when changing projects. Edits held only in memory cannot survive a browser crash or forced closure.
- Validate a project's format version, required fields, musical values, and internal references before adding it. A malformed or unsupported file must leave existing projects untouched and explain why it was rejected. Import, save, and any future format migration must avoid partially replacing valid stored data.
- Prevent stale writes from another tab from silently replacing newer project data. Choose the smallest suitable editing restriction or conflict check in [implementation planning](07-implementation-approach.md).
- Distinguish successful project saving from offline readiness. An initial online visit must obtain the app and required piano assets. Report offline readiness only after the necessary resources are available; an incomplete download is not ready. Verify closing and reopening the actual hosted app offline, then editing, playing, saving, and reopening a project.
- Do not claim that browser persistence permission or an offline-ready indicator is a backup. The chosen browser and host still need the checks described in the browser report.

### Acceptance checks for implementation

1. Create and name a project, edit it, observe a successful local save, then reopen it with the latest music intact. Undo/redo works within the open session and starts fresh after reopening.
2. Duplicate a project, edit the duplicate independently, move either copy to Trash, and restore it. Cancelling permanent deletion keeps it intact; confirmed deletion removes only the selected project.
3. Download and restore a project containing independent rhythms, same-pitch overlaps, a held note, split boxes, a short measure, key/collection changes, chosen/custom labels, and trailing empty measures. Compare musical state and relationships, allowing the new project identity. Restoring it twice creates independent copies.
4. Reject malformed and unsupported project files without changing existing projects. Simulate a failed local write: the saved copy remains valid, the failure stays visible, and the current edits can still be downloaded and restored. A stale editor must not silently overwrite a newer save.
5. After verified offline setup, close the browser, disconnect, reopen the actual app, play and edit a saved project, save, and reopen again. Test incomplete caching separately so it cannot produce a false ready status.
6. Clear local project storage in a disposable test profile, reopen the app, and restore a previously downloaded project file. No recovery of unexported changes is promised.
7. Inspect exported MIDI and open it in a real receiving editor. Check the three part tracks/channels, tempo, key/meter changes, supported rhythms, and held-note timing. Verify that boundary-crossing sustains are not retriggered.
8. Export overlapping equal pitches in one part: identify the positions and require acknowledgement before proceeding, preserve both written event pairs, and leave the source project unchanged. Equal pitches in different parts use distinct channels. Document actual receiving-editor behavior rather than claiming universal playback equivalence.

These checks define required evidence for the implementation. None has been run against an app or export yet.
