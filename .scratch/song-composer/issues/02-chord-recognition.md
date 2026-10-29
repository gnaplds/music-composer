# Define chord recognition and voicing tools

Parent: [Plan a playable desktop song composer](../map.md)
Labels: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: owner-and-codex
Blocked by: 01

## Question

How should chord recognition interpret independently moving notes, and which note-editing operations should the first version provide?

Decide whether recognition uses the chord part alone or includes sounding bass and melody; how a changing set of notes is labeled within one box; how alternatives such as C6 and Am7, slash chords, incomplete sets, and unknown chords are shown; and whether the composer can choose a preferred label. Define the scope and preconditions of inversion, drop 2, quality, and other voicing controls, including whether bass or melody can be protected while chord notes change. Recognition must preserve the notes entered by the composer.

## Comments

October 27, 2026: the owner accepted the recommendations in Q17–Q20, Q21–Q24, and Q25–Q27. The accepted rules are consolidated below. No implementation has been tested or approved by this interview.

October 27, 2026: [Define context changes and harmonic colors](03-musical-context.md) later refined chosen-label scope at key and collection boundaries. Its context rules govern that interaction.

## Answer

Resolved with the owner on October 27, 2026.

### Recognition follows the written notes

- Analyze the bass and chord parts, excluding the melody part. Use the notes active at the selected position while editing and at the playhead during playback. Include notes held from earlier boxes or measures.
- Activity follows written note starts and durations, not microphone analysis or residual piano release tails. Do not combine notes that occur at different times into a single pitch set.
- One box can therefore contain several recognized harmonies. Their presentation will be tested in [Test the desktop composition workspace](06-desktop-workspace.md).
- Use all active bass-and-chord pitches for the analysis. The lowest sounding note across those two parts determines the chord bass, even if it belongs to the chord part. Melody remains excluded from both pitch-set and chord-bass analysis.
- Octave doubling does not add another pitch class to the recognition set. Pitch register still matters for identifying the lowest sounding note and for voicing operations.
- Among exact matches, prefer a chord name whose root matches the chord bass. Offer other valid interpretations, including slash-chord forms. For example, A below C–E–G suggests Am7 before C6/A.
- Keep the Barry Harris color collection separate from this ranking rule. The composer can explicitly choose a sixth-chord interpretation instead.

### Labels express an interpretation

- Show a suggested name and alternatives. The composer may choose a supported interpretation or supply a clearly marked custom label.
- Choosing any label leaves pitches, note timing, and part assignments unchanged. A label is not an instruction to build or replace a chord.
- A chosen label applies to a continuous harmony span: the same bass-and-chord pitch classes and the same lowest sounding pitch class, subject to the key and collection boundary rules in [Define context changes and harmonic colors](03-musical-context.md). Such a span may cross box and measure boundaries; a moving melody alone does not divide it.
- Refresh recognition when relevant note edits change the harmony. A chosen name that no longer fits must not remain presented as a recognized match. Retain custom labels, but visibly mark them for review when their underlying harmony changes.
- If there are no active bass/chord notes, report that rather than implying the whole song is silent. For insufficient or unmatched pitch sets, show the notes and permit a custom label.
- Incomplete matches are suggestions and must identify missing notes. Do not silently ignore extra active notes or present a partial match as an exact recognition.
- Note spelling and the interaction between context changes and label scope are defined in [Define context changes and harmonic colors](03-musical-context.md).

### Initial recognition and builder vocabulary

Q66 on October 28, 2026 narrowed the original Q22 vocabulary to the following 14 qualities. Ninths, 6/9, and 7♭9 are deferred. This limits chord types, not registers or open voicings; existing written notes are preserved. See the fourth revision in [the prototype ticket](06-desktop-workspace.md) for the accepted Roman interpretation rules.

| Family | Qualities |
| --- | --- |
| Triads | Major, minor, diminished, augmented |
| Suspended | sus2, sus4 |
| Sixths | 6, m6 |
| Sevenths | 7, maj7, m7, m(maj7), m7♭5, dim7 |

All transposed roots are included. Exact notation and enharmonic spelling are a later context/display decision. Automatic naming beyond this vocabulary is deferred; those pitches remain freely playable and editable, with note display and custom labels available.

### Voicing tools change selected note events

- Tools operate only on explicitly selected chord-part notes. Preserve their start positions and durations, and leave bass and melody notes untouched.
- Apply a pitch change to each complete selected note event, including its earlier portion if it began in another box. Highlight the full affected span in the preview. A later portion must be separated into its own note before it can be edited independently.
- Preview before applying and support undo afterward. Unsuitable selections or pitches outside the supported range must produce an explanation rather than silent clipping, note removal, or an unrequested conversion.
- **Octave up/down:** move selected notes up or down one octave.
- **Close Position:** arrange selected chord tones within one octave. It changes pitch registers, not chord quality or note timing.
- **Rotate Up/Down:** from close position, move the lowest tone up an octave or the highest tone down an octave. These controls rotate the selected upper voicing; they do not promise to change the inversion of the full sounding harmony when a separate bass remains fixed.
- **Drop 2:** require four distinct close-position chord tones, then lower the second-highest by one octave. Do not silently normalize an already-open voicing; the composer can explicitly use Close Position first.
- Other drop patterns are deferred. Free note editing remains available for voicings outside these tool limits.

### Explicit chord construction

- In addition to manual entry, offer a chord builder with a root note and octave, a supported quality, a musical position, and a duration.
- Preview its resulting notes and insert them into the chord part only on explicit application. This is an insertion action; it does not silently replace or reshape existing notes.
- New boxes remain empty. Builder output consists of ordinary editable note events, subject to the same timing, playback, recognition, and undo rules as manually entered notes.
- This helper supplies a direct way to choose chord quality without guessing how to rewrite an arbitrary existing voicing. A dedicated quality-changing operation on existing voicings is outside the agreed first tool set.

### Acceptance scenarios

These are future checks, not passed tests:

1. Bass C with E–G–A in the chord part remains recognized as C6 while melody C moves to D. Adding D to the chord part changes the analyzed set.
2. A below C–E–G suggests Am7 and offers C6/A. Selecting C6/A changes only the label.
3. A note held from an earlier box participates in recognition at the current position. Moving only a box boundary does not change the detected harmony.
4. With A3 in the chord part below C4 in the bass part, the chord bass is A3. The arrangement roles do not override the actual register.
5. A custom label remains visibly custom, and is marked for review after an edit changes the underlying harmony. Unsupported notes remain intact and playable.
6. Drop 2 on selected C4–E4–G4–A4 produces G3–C4–E4–A4, with original event starts and durations preserved. A three-tone or already-open selection receives an explanation instead of a guessed transformation.
7. Revoicing a held note affects its whole highlighted event, including earlier time. Bass and melody remain unchanged, and undo restores all affected chord notes.
8. The builder can insert C6 as C4–E4–G4–A4. Editing or removing one of those notes behaves exactly like editing a manually entered note.

The prototype must settle the detailed selection controls and display. Implementation must choose deterministic handling for unsuitable or duplicate selections and validate the supported recognition vocabulary; neither an algorithm nor a library was chosen here.
