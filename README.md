# Simple Composer

A browser app for writing music with an on-screen piano, a timeline of chord boxes, and independent Melody, Chord, and Bass parts. Build a phrase, explore its harmony, and hear the parts together.

**[Open Simple Composer](https://simplecomposer.netlify.app/)** — no account or installation needed.

This is a working prototype. **Notes are not saved:** reloading, closing, or discarding the browser tab loses the composition.

## Write and arrange

- Enter notes on the piano with separate duration settings for Melody, Chord, and Bass. Use whole through sixteenth notes, dotted values, and quarter- or eighth-note triplets.
- Advance the cursor after each note to write a melody, or keep it in place to build a chord. Each part remembers its own entry settings during the session.
- Give every note its own start and duration. Hold a bass note while the melody and chord voices move, including across measures.
- Organize the timeline by splitting and merging chord boxes without changing the notes.
- Change the time signature within a composition: 2/4, 3/4, 4/4, and 6/8 are supported. Notes entered beyond the song's end add measures automatically.

## Edit and navigate

- Edit a note's pitch, start, and duration, or drag it along the timeline to move or resize it.
- Select notes across parts, then move, resize, or delete them together. Group edits preserve relative timing and can be undone in one step.
- Snap edits to quarter notes, eighth notes, or quarter- and eighth-note triplets. Invalid edits, including overlapping notes of the same pitch in one part, are rejected.
- Undo and redo musical edits. Pan and zoom the timeline, collapse individual parts, or hide all three part rows while keeping chord labels and the ruler visible.
- Drag the wider editing cursor handle to inspect active notes silently. Resize the piano vertically by dragging its top handle on desktop or landscape phones.

## Explore harmony

- See chord names based on the sounding Bass and Chord notes. Melody notes remain independent of chord recognition.
- Recognize 14 chord qualities: major, minor, diminished, augmented, sus2, sus4, 6, m6, 7, maj7, m7, m(maj7), m7♭5, and dim7.
- Choose an alternative recognized name or write a custom chord label without changing the notes.
- View Roman numerals and inversion figures relative to the active key. Choose compatible readings for secondary dominants, tritone substitutes, leading-tone diminished chords, and modal interchange.
- Change the key from the cursor or apply a key to selected chord boxes, including separated boxes. Key changes and harmonic collections have independent settings.
- Use major or minor sixth-diminished collections to distinguish sixth-chord tones, diminished-chord tones, and outside tones. Optional piano symbols and note names support this view.

## Listen and review

- Play, pause, and resume the composition at an adjustable tempo, or loop a range of whole measures.
- Use a metronome with accented measure starts. In 6/8, it follows dotted-quarter pulses.
- Adjust each part's volume independently, including muting it.
- Follow the playhead and highlighted chord boxes during playback. Piano keys audition notes while the composition plays.
- Switch to dark mode, turn on key labels (hidden by default), and open built-in help, shortcuts, and guided examples for held bass, moving inner voices, and context changes.

## Desktop and phone

The same app adapts to both screens. Desktop supports mouse editing and selection shortcuts. On a phone, landscape mode provides a two-octave piano, touch selection, and explicit Move, Resize, and Delete actions; ordinary swipes scroll the timeline. Secondary controls are in Tools.

Portrait mode supports review and playback. Rotating back to landscape preserves notes and selections within the current session.

## Current limits

- No project saving, project import/export, or MIDI export.
- Playback uses a temporary synth sound.
- Automatic chord naming covers the 14 qualities above. Extended chords remain playable but may have no automatic name; pitch spelling currently uses practical flat names.
- Compositions are limited to 256 quarter notes. Measure insertion/deletion, draggable box boundaries, and the full voicing toolbox are not implemented.
- The phone layout has been checked in resized desktop browsers; physical-phone usability and audio checks are still pending.
