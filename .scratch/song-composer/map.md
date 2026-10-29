# Plan a playable desktop song composer

Labels: wayfinder:map
Status: open

## Destination

An agreed, implementation-ready specification for a playable desktop website for personal song composition and arranging. It must define the musical model, editing workflow, sound, saving, and a testable first release; mobile adaptation follows later.

## Notes

- The [planning intake](../../docs/planning-intake.md) holds the baseline agreed before this map was created. Preserve it unless the owner revises it.
- Use Wayfinder for the map and Grilling with Domain Modeling for human decisions. Consult Research for outside facts, Prototype for interaction experiments, and Sites when implementation or hosting choices become relevant.
- Use plain, direct language. Ask for preferences and decisions; investigate technical facts rather than asking the owner to supply them.
- This map plans the implementation. A prototype may test a specific question, but it does not approve the final experience on the owner's behalf.
- App vocabulary lives in the [glossary](../../GLOSSARY.md); the [Barry Harris study](../../barry-harris/README.md) supplies musical context with its stated evidence limits.
- Use local Markdown issues. Each ticket's `Blocked by` field lists prerequisite ticket identities. Open, unclaimed tickets whose blockers are resolved form the frontier; choose the lowest number first. Claim a ticket before work. Human decisions require the owner's response.
- The owner authorized a public `gnaplds/music-composer` repository on October 29, 2026. Keep research and prototype artifacts with their ticket pointers. The separate `barry-harris/` study stays local; do not publish unrelated files to satisfy a branch convention.

## Decisions so far

- [Verify desktop audio and offline feasibility](issues/04-browser-feasibility.md): browser APIs support the planned baseline, with explicit audio activation, offline asset caching, and storage-recovery requirements; runtime validation remains necessary.
- [Define note timing and chord-box editing](issues/01-note-timing.md): step entry and independent note timing are agreed, including box boundaries, sustained notes, measure edits, undo/redo, and the initial rhythm and playback limits. Q74 adds atomic group movement and resizing across parts. The eighth prototype revision also adds per-part entry durations, a visible piano-entry lane, 5% volume steps, and playback following; owner trial remains pending.
- [Define chord recognition and voicing tools](issues/02-chord-recognition.md): recognize sounding bass/chord notes, keep labels separate from note edits, and provide a bounded voicing tool set plus an explicit chord builder. Q66 limits the vocabulary to triads, suspended chords, sixths, and sevenths while retaining open voicings. The [workspace prototype ticket](issues/06-desktop-workspace.md) records the later Roman interpretation choices.
- [Define context changes and harmonic colors](issues/03-musical-context.md): keep key, meter, and collection independent; preserve note timing during meter edits; and color major/minor sixth-diminished families using the active context.
- [Define project recovery and file exchange](issues/05-project-recovery.md): use local autosave, portable project backups restored as new copies, recoverable project deletion, session undo, and whole-song MIDI export with explicit same-pitch overlap handling.

## Not yet specified

- Refinements exposed by trying real phrases in the desktop editor, including dense passages and correction workflows.
- The amount of musical expression needed beyond the initial playback baseline, after the first release's writing workflow is tested.

## Out of scope

- Shipping the production app during this planning map; the destination is the specification that guides that work.
- Mobile adaptation and native mobile packaging in this desktop effort, following the owner's desktop-first change. The owner opened a separate [Android workspace plan](../song-composer-mobile/map.md) on October 29, 2026; that effort begins with a landscape browser touch prototype and evaluates Godot before an engine choice.
- Automatic generation of progressions, bass lines, or melodies, following the agreed manual-composition baseline.
- Live recording, tempo changes within a song, and swing playback in the first version, as agreed in [Define note timing and chord-box editing](issues/01-note-timing.md).
- Automatic naming of ninths, 6/9, 7♭9, 11ths, 13ths, and further altered qualities; additional drop patterns; and automatic quality changes to existing voicings are beyond the first tool set in [Define chord recognition and voicing tools](issues/02-chord-recognition.md). Manual entry of those notes remains supported.
- Dominant-diminished color collections and strict notation spelling with double accidentals are deferred under [Define context changes and harmonic colors](issues/03-musical-context.md); the associated pitches remain playable.
- App accounts and cloud project sync, automatic version history and undo across reopening, selected-passage MIDI export, MIDI import, audio-file export, and external MIDI keyboard input are deferred under [Define project recovery and file exchange](issues/05-project-recovery.md). Full project-file import and whole-song MIDI export are included.
- Public-product launch strategy, subscriptions, and collaborative composition; the destination is the owner's personal first version.
