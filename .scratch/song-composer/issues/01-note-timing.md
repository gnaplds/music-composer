# Define note timing and chord-box editing

Parent: [Plan a playable desktop song composer](../map.md)
Labels: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: owner-and-codex
Blocked by: none

## Question

Within the agreed model of independent bass, melody, and chord timing, what are the exact rules for entering and editing notes and boxes?

Decide the supported meters and rhythmic subdivisions; note start and duration entry; silence, overlapping notes, and sustained notes across boxes or measures; box insertion, resizing, deletion, and overflow; tempo and loop boundaries. Test a held bass with a moving melody and changing inner chord notes, plus a note sustained across a measure boundary. Define which behavior is required in the first version. Later edits that change musical context belong to [Define context changes and harmonic colors](03-musical-context.md).

## Comments

October 27, 2026: the owner accepted the recommendations in questions Q9–Q11, Q12–Q15, and the insertion/deletion clarification in Q16. The accepted rules are consolidated in the answer below.

## Answer

Resolved with the owner on October 27, 2026. These are the first version's timing and editing rules.

### Entering notes and choosing rhythms

- Use step entry: choose a part, start position, and duration, then click piano keys. Multiple pitches can be added at one position. Live recording is deferred.
- Support 2/4, 3/4, 4/4, and 6/8 initially.
- Support whole, half, quarter, eighth, and sixteenth notes; dotted versions of those durations; and quarter-note and eighth-note triplets (quarter-note triplets added by the owner on October 28, 2026). Note length is independent of the meter, so a whole note can extend beyond a short measure.
- Bass, melody, and chord are assigned musical roles. Each part permits multiple simultaneous pitches; entering another note does not implicitly replace an existing note. Q70 on October 28, 2026 adds a restriction: entry and edits must reject overlapping notes at the same pitch and octave within one part. Equal pitches in other parts, octave-separated pitches, and notes meeting at an exact end/start boundary remain allowed.
- Notes have independent starts and durations. A note can continue across box and measure boundaries without starting again; show its continuation visibly. An interval with no active notes in a part is silence for that part.

The later prototype revision makes Quarter the default snap and offers Eighth, Quarter triplet, and Eighth triplet. Sixteenth remains a duration but is removed from snap. Piano-key right-click deletes the complete matching note active at the editing cursor in the selected part, with undo; no matching note is a no-op. See [the prototype ticket](06-desktop-workspace.md) for evidence.

The eighth revision starts Chord entry at Half, with Melody and Bass at Quarter. Each part remembers its chosen entry duration during the page session. Editing an existing note does not change that preference. The active piano-entry part is highlighted in the timeline.

### Organizing boxes and editing musical time

- A measure starts with one empty box. Boxes partition the measure without gaps or overlaps and can be split, merged, or resized within it.
- Changing box boundaries leaves the notes at their existing musical positions and preserves their durations. A note is associated with the box containing its start; moving a boundary may change that association without changing the sound.
- Move notes explicitly to change their start positions. If a note extends past the end of the song, add enough measures to contain its full duration.
- Q74 accepts note-group editing across parts. Ctrl/Cmd-click or Shift-click toggles individual notes. Dragging a selected body moves all selected notes by the same time offset, snapping the dragged note's start. Dragging its right edge changes every selected duration by the same amount, snapping the dragged note's length from its start. Preserve pitches, parts, and relative starts. Preview first and commit one undo step; reject the whole edit if any duration becomes nonpositive, any start is negative, any same-pitch overlap is created within a part, or the prototype's 256-quarter-note limit is exceeded.
- Clearing a box removes notes that start in that box and preserves the box's time span. Notes held from earlier boxes remain.
- Inserting a whole measure shifts notes starting at or after its insertion point later by the inserted duration. Notes already sounding retain their existing durations.
- Deleting a whole measure removes notes starting inside its time span and shifts later note starts earlier by the removed duration. An earlier note is shortened by the portion of its duration that lies in the deleted interval. No new note is created from the tail of a note whose start was deleted.
- All musical edits support undo/redo, including clearing, structural edits, and automatic song extension. Undo restores the previous music.
- Musical-context changes and their treatment during structural edits remain in [Define context changes and harmonic colors](03-musical-context.md).

### Playback and looping

- Provide one song-wide tempo, explicitly shown as quarter-note BPM in every meter. Tempo changes inside the song and swing playback are deferred.
- Q50 replaces the original three transport buttons with one Play/Pause button that resumes from the paused position. Choosing a timeline position pauses and changes the next start; playback at the song end returns to the editing position. Loops cover whole measures.
- The eighth revision highlights the playing box without a play glyph and scrolls to keep playback visible, including loop returns. Smooth scrolling respects reduced-motion preferences. Each part's session volume slider uses 5% increments.
- The ninth revision clears box selection on successful playback start and scrolls earlier to expose the upcoming chord label. It raises the temporary synth's note level with shared peak compression; written notes and part-volume preferences are unchanged. Browser evidence and remaining listening checks are recorded in the [prototype ticket](06-desktop-workspace.md).
- Starting playback inside a sustained note sounds it for its remaining duration. This playback start is distinct from simply crossing a box or measure boundary during uninterrupted playback, which does not restart it.
- At a loop end, release the active notes. On returning to the loop start, sound the notes active at that position. This avoids voices accumulating across repeated loops.

### Consequences and later checks

The editor must distinguish box boundaries from note timing. The [timing ADR](../../../docs/adr/0001-independent-note-timing.md) records the reason for that boundary; this answer is the canonical set of behavior rules.

The desktop prototype must test a held bass under a moving melody, inner chord motion under a held melody, split/merge without altered playback, note extension beyond the song end, insertion/deletion around a held note, and looping from within a held note. These are accepted requirements, not claims that an implementation has passed them.
