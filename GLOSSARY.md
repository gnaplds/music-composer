# Song composition app

Terms established by the project brief and scope interview. Musical study terms are defined in the separate [Barry Harris glossary](barry-harris/GLOSSARY.md).

## Language

**Project**:
A composition workspace containing a song's measures and musical material.

**Project file**:
A portable snapshot of a project's complete composition state, used for backup or transfer and restored as a new project copy. It is distinct from a MIDI file or an audio recording.

**Local autosave**:
Automatic saving of completed edits in the current browser's storage. It preserves the latest saved project state, not a separate backup or an edit history across sessions.

**Measure**:
A division of musical time governed by a time signature.
_Avoid_: Switching between “measure” and “bar” in app documentation; use “measure.”

**Chord box**:
A visual span within a measure that groups bass, melody, and chord notes by their start positions. Its boundaries organize the music; notes have their own timing and may sustain beyond those boundaries.

**Bass part**:
The musical material assigned to the bass role in a chord box.

**Melody part**:
The musical material assigned to the melody role in a chord box.

**Box selection**:
One or more chord boxes chosen as the scope of an edit. Selected boxes can be adjacent or separated by unselected boxes.

**Part volume**:
The playback level of one musical part across the song, separate from its written notes and harmonic role.

**Chord part**:
The musical material assigned to the chord role in a chord box, distinct from its bass and melody parts.

**Note**:
A pitched musical event with a start position and a duration, assigned to one part.

**Note selection**:
One or more notes chosen for editing, possibly across parts. A group move applies the same time offset to every note; a group resize applies the same duration change. Selection does not combine the notes or change their assigned parts.

**Same-pitch overlap**:
Two notes at the same pitch and octave whose time spans overlap within one part. Notes that only meet at an end/start boundary do not overlap. Equal pitches in different parts remain distinct.

**Sustained note**:
A note that continues sounding for its duration, including across box or measure boundaries, without starting again at those boundaries.

**Step entry**:
Writing notes by choosing a part, start position, and duration, then selecting pitches. It does not depend on recording the timing of a live performance.

**Advance after entry**:
Moving the editing cursor to the end of a newly entered note, ready for the next note. When disabled, notes can be entered together at the same position.

**Snap**:
Aligning an editing gesture to a rhythmic grid or nearby note boundaries. Moving a note aligns its start to the timeline grid; resizing measures increments from the note's fixed start.

**Editing cursor**:
The selected musical position used for note entry and for inspecting harmony and context while playback is stopped. It is distinct from the moving playback position.

**Silent preview**:
Viewing the notes active at the editing cursor without playing them. A note is active from its start until, but not including, its end.

**Chord recognition**:
Identifying possible chord names from bass and chord notes sounding at a selected or playback position. Melody notes are excluded from this analysis.

**Chord label**:
A suggested, composer-selected, or custom name for the harmony at a musical position. Choosing a label does not change the written notes.

**Roman numeral label**:
A chord's root degree and quality, with inversion figures or a chosen harmonic interpretation, relative to the active key. Interpretations can identify a dominant target, a substitute or leading-tone role, or a parallel-mode source. This project uses the tonic's major scale as the degree reference in both modes, so E♭ in C minor is ♭III.

**Secondary-dominant interpretation**:
Reading a chord as the dominant of a chord other than the home tonic. For example, C7 in C major can be read as V7/IV, the dominant of F major. Compatible notes suggest a possible interpretation; the composer chooses its intended function.

**Roman inversion figure**:
A number or vertically stacked pair identifying which chord tone is in the actual bass: 6 or 6 above 4 for an inverted triad, and 6 above 5, 4 above 3, or 4 above 2 for an inverted seventh chord. There is no slash or fraction bar between stacked figures. It differs from the added sixth in a chord such as C6.

**Tritone-substitute interpretation**:
Reading a dominant seventh chord as a substitute for a dominant whose root is a tritone away. D♭7 can stand in for G7 toward C, labeled subV7/I in C major.

**Leading-tone diminished interpretation**:
Reading a diminished chord as leading toward a target whose root is a semitone above the chord root. A compatible pitch set offers a possible reading, not proof of its role in a passage.

**Modal interchange**:
Reading a chord as borrowed from another mode with the same tonic. Several parallel modes can contain the same chord, so the source is an interpretation chosen by the composer.

**Harmony span**:
A continuous passage with the same sounding bass-and-chord pitch classes and lowest sounding pitch class, within one key and harmonic-collection context. It is the scope of a chosen chord label; box or meter boundaries alone do not divide it.

**Chord bass**:
The lowest sounding note among the bass and chord parts at a position, used to identify inversions and slash chords. It can belong to either part.
_Avoid_: Treating “bass part” and “chord bass” as interchangeable.

**Voicing**:
The arrangement of chord notes across pitch registers, including their spacing and doubling. It is distinct from the chord's name.

**Pitch class**:
A pitch identity without its octave; C3 and C4 belong to the same pitch class. Recognition distinguishes pitch classes from the registered notes used to play a voicing.

**Voicing rotation**:
Moving the lowest tone of a close-position voicing up an octave, or the highest tone down an octave. It changes the selected voicing's order and does not necessarily change the bass of the full harmony.

**Chord quality**:
The interval structure relative to a chord's root, such as major, minor, diminished, or a particular seventh or extended form.

**Chord builder**:
An explicit writing tool that creates editable chord-part notes from a chosen root, quality, position, and duration. Its output is musical notes rather than a fixed chord object.

**Song key**:
The tonal center and major or minor mode assigned to the song or a passage. It is distinct from the collection used to color notes.

**Harmonic collection**:
The selected major or minor sixth-diminished collection used to interpret and color notes in a passage. Its sixth-chord and associated diminished tones are separate groups within that collection, independently of the song key.

**Context marker**:
A key, meter, or harmonic-collection setting at a musical position, effective until the next marker of the same type. The three types have independent timelines.

**Short measure**:
A measure whose actual duration is shorter than its time signature's nominal length because a new meter begins before that length is complete.

**Enharmonic names**:
Different names for the same sounding pitch on the piano, such as A♭ and G♯. They do not represent different note-family memberships within one harmonic collection.

**Sixth-chord tone**:
A note belonging to the sixth chord in the selected harmonic collection; C, E, G, and A are examples in C major sixth-diminished.
_Avoid_: “Major note,” which does not identify the note's role in this collection.

**Diminished-chord tone**:
A note belonging to the associated diminished seventh chord in the selected harmonic collection; D, F, A♭, and B are examples in C major sixth-diminished.
