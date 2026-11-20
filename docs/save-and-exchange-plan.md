# Saved compositions and file exchange

Status: implemented locally; hosted browser and device acceptance checks remain. Updated November 20, 2026.

The owner approved this plan. The local prototype now includes the agreed save, project-file, MIDI, and offline features. This document records implementation and remaining checks; it does not claim deployment or complete browser acceptance.

## Existing agreements

The [recovery decision](../.scratch/song-composer/issues/05-project-recovery.md) and [local-project ADR](adr/0003-local-projects-and-portable-backups.md) remain the baseline:

- Autosave completed edits in the current browser. Show a successful save only after the write succeeds.
- Keep named compositions with Create, Rename, Duplicate, Trash, Restore, and confirmed permanent deletion. Do not purge Trash automatically.
- Keep undo history within the current editing session. Reopening starts a fresh history.
- Import a full project file as a new independent copy. Never overwrite an existing composition during import.
- Preserve complete musical state and tempo in project files. A file is a snapshot, not an audio recording or an automatic backup of later edits.
- Export the whole song as MIDI, with separate Bass, Chord, and Melody tracks/channels, tempo, and key/meter changes. Preserve written timing and sustained notes.
- Keep app-specific boxes, collections, and labels in full project files. MIDI does not promise to restore those meanings.
- Reject malformed or unsupported files without changing existing compositions. Preserve valid saved data and current in-memory edits after save failure. Prevent stale writes from another tab.
- No app account, cloud sync, MIDI import, or audio export in this update.

## Confirmed in this planning session

### Q1 — Scope

The owner confirmed saved compositions, full project-file import/export, and MIDI export. MIDI import and WAV/MP3 export remain deferred.

### Q2 — Opening the app

The owner confirmed automatic reopening of the last composition. The composition name opens project management (updated in the approved November 20 polish). On the first visit, open an Untitled composition and save it automatically after the first edit.

### Q3 — Composition settings and browser appearance

The owner confirmed that each composition preserves tempo, part volumes, loop settings, metronome, note durations per part, automatic advance per part, snap, cursor position, and active part. Playback always reopens paused. Appearance settings, including dark mode, piano height, and label visibility, stay with the browser.

### Q4 — Guided examples

The owner confirmed that an example creates a separate saved composition, such as Example: Held bass. It does not replace the current composition.

### Q5 — Offline reopening

The owner confirmed offline reopening after a successful online setup. Show Ready offline only after the required app files are available. Verify closing and reopening the hosted app without a network connection, then editing, playing, saving, and reopening a composition.

### Q6 — MIDI receiving application

The owner has no preferred receiving application and delegated its selection during technical planning. A receiving-editor test remains required; a successful file download alone is insufficient.

**Plan choice:** use MuseScore Studio as the receiving editor. It supports MIDI files. An independent MIDI parser will check exact events and timing. MuseScore is installed in the current development environment, but its command-line launch failed there; a real editor check must run in an environment where MuseScore opens. [MuseScore file support](https://handbook.musescore.org/file-management/opening-and-saving-scores)

### Q7 — Conflicting tabs

The owner confirmed that a stale tab stops autosaving and retains its current edits. It offers Save as a new composition or Open the latest saved version. Opening the latest version warns before discarding unsaved edits. No silent overwrite or automatic merge occurs.

### Q8 — MIDI part volumes

The owner confirmed exporting each part's volume while retaining every written note. Muted parts keep their notes with zero volume. Export contains the whole song once, without metronome clicks or repeated loops. Receiving instruments can sound different.

## Final plan review

The owner answered Q1–Q8 and approved implementation. The implementation choices and limits below remain the agreed scope.

## User workflow

1. Open the last active composition, paused. If none exists, open an Untitled composition. Save the initial draft after its first completed edit. Explicitly created or named compositions can be saved while empty.
2. Keep the current composition name and local-save status visible. Make the composition name open the composition list on desktop and mobile. The list shows names and last-edited times, with Create, Open, Rename, Duplicate, and Move to Trash. Keep Restore and confirmed permanent deletion in a separate Trash view.
3. Keep automatic save status clear: Saving, Saved locally, or Could not save. After failure, keep the current edits and last valid saved record. Offer Retry and Download project file. Block silent loss during project switching, example creation, or replacement.
4. Give each new, duplicated, or imported composition its own identity. Duplicate opens the copy. Import validates the file, saves a new copy, and opens it only after protecting the current work. Matching names never imply overwrite. Use readable Copy/Imported name suffixes where needed.
5. Offer Download project file, Import project file, and Export MIDI in the Compositions view. Downloads use the current in-memory composition, including edits that failed to save. A download does not change the Saved locally status.
6. Starting a guided example creates a separate named composition. Each completed example step uses the same autosave path as ordinary edits.
7. Reopen with the saved playback and entry settings, a fresh undo history, no transient note/box selection, and playback paused. Browser appearance remains separate from project files. Clamp size-dependent view settings to the current screen.
8. After successful online setup, show Ready offline separately from the local-save status. An incomplete cache never shows readiness. A new app version must not force a reload or discard edits. Offer an update only through a safe saved-state transition.
9. Keep a stale tab's edits visible when another tab saves, trashes, or removes that composition. Offer an independent copy or a deliberate return to the latest available state. Never resurrect a trashed composition through a stale autosave.

## Data boundaries

| Stored with a composition and in its project file | Kept as browser appearance preferences | Temporary session state |
| --- | --- | --- |
| Name, notes and parts, exact timing, labels and Roman choices, box boundaries, song extent, key/meter/collection markers | Dark mode, note names/symbols, key-label visibility, hidden/collapsed parts | Undo/redo history, active playback, selected notes/boxes |
| Tempo, part volumes, loop range/enabled state, metronome | Piano height and control visibility, octave view, timeline zoom | Unfinished drags, open dialogs, guided-example progress |
| Per-part entry durations and automatic advance, snap, cursor position, active part | Values adapt to available screen space | Pending save operations |

A full project file uses a versioned JSON format, proposed filename `Name.simple-composer.json`. Import validates format/version, size bounds, names, numeric limits, note identities, timing, marker order, label scopes, and references before any storage change. Unknown future versions fail clearly. Import never executes file content or inserts names as HTML. Invalid music is rejected rather than silently repaired or quantized. The accepted same-pitch overlap exception remains valid for restored compositions.

Project files preserve exact part-volume values and settings. MIDI uses its own integer fields and carries no app appearance preferences, selection, undo history, collections, or custom chord-box meanings.

## Implementation facts

The current app keeps one composition in memory. No local storage, project-file decoder, MIDI writer, or offline cache exists.

The musical model holds notes, labels, box cuts, song extent, and key/meter/collection markers. Tempo and other playback, entry, and view settings sit outside that model. Autosave must cover piano entry, Next step, guided examples, and relevant settings, as well as ordinary edits.

The existing 51 tests exercise editing commands, inspection, and playback plans. File validation and round-trip restoration need direct tests. Browser checks must cover save status, save failure, project switching, real downloads/imports, reopening, and competing tabs. The existing recovery specification also requires a MIDI check in a receiving editor.

The accepted recovery rules allow restored same-pitch overlaps, although normal editing rejects new overlaps. Import must preserve this exception and MIDI export must warn without rewriting those notes.

## Technical approach used

- Keep the single-page static app and add no package dependency. The Netlify build copies the app page and service worker to the publish directory.
- Use IndexedDB for composition records and browser preferences. Give every record a unique ID, revision, edit time, and Trash state. Save composition data and its settings together. In one transaction, compare the expected revision and write the next revision. Broadcast revision changes to other tabs for prompt feedback; the IndexedDB comparison remains the final guard. A stale tab keeps its unsaved edits in memory and can save them as a new composition. Trash and permanent deletion use the same revision checks.
- Use a versioned JSON project file and the browser's file picker and download APIs. The file stores a format version and the complete composition snapshot, including composition settings. Validate the complete file before creating a new record. Never execute file contents. Keep the source and all saved copies intact if validation or writing fails.
- Implement MIDI 1.0 Standard MIDI File Type 1 with a tempo/context track and three named part tracks on distinct channels. Use 480 ticks per quarter note, which exactly represents the app's 1/24-quarter rhythmic grid. Write song-wide tempo, key and meter markers, part volume, and note on/off events for the full song. Do not repeat loop sections or include metronome clicks. Keep the accepted same-pitch overlap warning and export the original events unchanged after the user acknowledges it.
- The app accepts tempos from 1 to 300 BPM, but MIDI's tempo field cannot encode 1–3 BPM. Show a clear export error at those values; do not change the project tempo or notes. Supported values use the nearest representable integer microseconds per quarter note. Check the app's other supported timing values before fixing the file writer.
- Use a service worker with versioned app caches. The current sound is synthesized and has no external sample files to cache. Mark Ready offline only after the service worker controls the page and all required app files are cached. Install a new cache fully before replacing an older working cache. Do not force a reload while the user is editing.
- Show local-save status separately from offline readiness. Ask the browser for persistent storage where supported, but describe project files as the backup. Browser storage can still be cleared by the user.

The current static build and single-page app make direct browser APIs the smallest fit. IndexedDB supports transactions for atomic project updates. The web storage standard explains that persistent storage can still be cleared. The service-worker lifecycle guidance supports installing a new cache before switching app versions. These design facts do not prove the app will work; the acceptance checks below still apply. [IndexedDB](https://www.w3.org/TR/IndexedDB/), [Storage Standard](https://storage.spec.whatwg.org/), [service-worker lifecycle](https://web.dev/articles/service-worker-lifecycle), [Standard MIDI Files](https://midi.org/standard-midi-files).

## Implementation status — October 31, 2026

- Added validated composition snapshots, IndexedDB autosave and management, Trash and restore, save-failure recovery, and revision checks for competing tabs.
- Added versioned JSON project download/import, Type 1 MIDI export with part volumes and overlap warnings, and a service worker for offline reopening and saved app updates.
- Updated app help, both READMEs, Netlify build output, the recovery issue, and the glossary.
- Automated model and exchange checks pass: 55 checks. Inline scripts compile, static element IDs are unique, Netlify output matches the source files, and `git diff --check` is clean.
- Browser automation is disabled in Work settings. A headless browser attempt timed out and was cleaned up; no live UI, IndexedDB, service-worker, two-tab, or offline-session check is claimed. MuseScore Studio did not launch in this environment, so receiving-editor verification remains open. Physical phone checks also remain open.

## Original delivery order

1. Add a versioned composition snapshot and one strict validation/restore path. Cover round trips and malformed files.
2. Add IndexedDB autosave, project management, save-failure handling, and revision conflict checks. Connect edits and settings, including piano entry, Next step, undo/redo, and guided examples.
3. Add project-file download/import and safe switching. Import and downloads must preserve copies and failed-save edits.
4. Add MIDI export, an independent parser check, and the MuseScore Studio receiving-editor check. Report any editor-specific limitations.
5. Add offline caching and safe app updates. Publish all required files through the existing Netlify build.
6. Update Help and README. Complete hosted browser checks and the owner's physical-phone trial before claiming device acceptance.

## Acceptance checks

- Save and reopen every supported musical feature and all agreed composition settings. Reopen paused with fresh undo history.
- Create, rename, duplicate, Trash, restore, and permanently delete only the intended composition. Confirm example and imported copies do not change prior work.
- Import a project file with same-pitch overlaps. Compare the restored notes, boundaries, labels, markers, and settings. Reject corrupt, oversized, unsupported-version, out-of-range, and broken-reference files without changing saved compositions.
- Force a storage failure. Keep the last valid record and current in-memory edits; verify the error, Retry, and project-file download of those edits. Check switching safeguards.
- Use two tabs to test competing edits, Trash, restore, and deletion. Confirm a stale tab cannot overwrite or resurrect a record, and can save its edits as a separate copy.
- Check MIDI structure with an independent parser, then open it in MuseScore Studio. Verify tracks/channels, tempo, key/meter events, volume, mute, exact timing, held notes, and song length. Confirm no loop repeats or metronome clicks. Verify overlap warnings and source preservation.
- Check 1–3 BPM MIDI rejection and supported tempo encoding. Never alter the composition to make MIDI export succeed.
- Test incomplete offline setup, Ready offline, closing and reopening the hosted app offline, offline edit/play/save/reopen, and an update with existing projects. Check storage denial and cleared data only in disposable profiles.
- Check project controls on desktop and mobile. Repeat offline/import/download on the agreed Android phone. Automated checks do not establish touch or sound quality.

