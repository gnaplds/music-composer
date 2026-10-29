# Define context changes and harmonic colors

Parent: [Plan a playable desktop song composer](../map.md)
Labels: wayfinder:grilling
Type: grilling
Status: resolved
Assignee: owner-and-codex
Blocked by: 01

## Question

How are song key, meter, and the selected harmonic collection assigned along the timeline, and what happens when they change after notes have been written?

Decide the initial set of keys and Barry Harris collections; the placement and inheritance of context changes; whether key changes transpose pitches or only change context; and how changes preserve existing music. Use the meters chosen in [Define note timing and chord-box editing](01-note-timing.md), and test a change from 4/4 to 3/4 inside an existing passage. Define how playback and selection choose the keyboard's active color context, how note spelling is displayed, and how labels or symbols make family membership readable without relying on color alone. Preserve the agreed freedom to enter notes outside the selected collection.

## Comments

October 27, 2026: the owner accepted Q28–Q31 and Q32–Q35. The agreed rules are consolidated below. The label-context rule refines the earlier recognition decision without changing its pitch-based recognition or ranking rules.

## Answer

Resolved with the owner on October 27, 2026.

### Supported contexts and independent markers

- Support major and minor keys on all twelve tonic pitches, using common key names. Enharmonic names refer to the same tonic pitch rather than adding another sounding tonic.
- Support major sixth-diminished and minor sixth-diminished harmonic collections on all twelve tonic pitches. Dominant-diminished and dominant-flat-five-diminished color collections are deferred.
- Give the project initial values for key, meter, and harmonic collection. Later settings have separate context markers; each is effective from its musical position until the next marker of the same type.
- Key and collection markers can occur at an editable musical position. A meter marker starts a new measure, including when placed inside an existing measure.
- Q71 adds a bounded key edit over selected chord boxes. Replace key context only inside their spans and restore the original key at each selected region’s end, preserving unselected gaps and later music. Adjacent selected boxes form one region. The edit is one undo step; notes and collection markers remain intact. See [the prototype ticket](06-desktop-workspace.md).
- A key change does not select another collection. A collection change does not change the key. Neither operation transposes existing notes or changes their timing.
- Removing a later marker directly restores inheritance from the preceding marker of that type. This is an intentional context edit, distinct from deleting a measure while preserving the context of its surviving music.
- The supported meters remain 2/4, 3/4, 4/4, and 6/8, as agreed in [Define note timing and chord-box editing](01-note-timing.md).

### Note families and their meaning

| Collection in C | Sixth-chord tones | Associated diminished tones | Complete collection |
| --- | --- | --- | --- |
| Major sixth-diminished | C, E, G, A | D, F, A♭, B | C, D, E, F, G, A♭, A, B |
| Minor sixth-diminished | C, E♭, G, A | D, F, A♭, B | C, D, E♭, F, G, A♭, A, B |

These sets follow the existing [Barry Harris harmony guide](../../../barry-harris/BARRY-HARRIS-HARMONY.md). For other tonics, transpose the pitch-class relationships. Relative to the collection tonic, the major sixth-chord family is 0, 4, 7, 9 semitones; the minor family is 0, 3, 7, 9; the associated diminished family is 2, 5, 8, 11. Each collection has two disjoint four-note families and four other pitch classes outside it.

- Family membership depends on the selected collection and sounding pitch class, not the song key, octave, part assignment, or sharp/flat spelling.
- Use distinct appearances for sixth-chord tones and diminished-chord tones, and a neutral appearance for other pitches. Neutral does not mean forbidden or incorrect; all pitches remain available.
- Provide a legend or symbols alongside colors. Exact hues and their accessible contrast belong to the desktop prototype, not this musical classification.

### Active keyboard context and spelling

- During playback, keyboard colors follow the playhead's collection. Outside playback, they follow the selected editing position. Stop returns the display to that editing position.
- Always show the active collection name. Indicate sounding keys separately from the family colors, so sounding-note highlights do not erase the harmonic guidance.
- A note held across a collection change can change family color without being restarted or changing pitch. Do not freeze its displayed family at its note-on position.
- Use practical piano-key names: natural names for white-key pitches and suitable sharp/flat names for black-key pitches, guided by the active collection and key. Avoid double accidentals in the first version.
- In C major sixth-diminished, display C–D–E–F–G–A♭–A–B. This is a practical pitch display, not a requirement to spell every recognized chord as formal notation would; the guide notes that strict Ddim7 spelling would use C♭ in place of B.
- Show equivalent pitch names, such as A♭/G♯, when inspecting a note. A spelling change cannot change the pitch or its family membership.
- Preserve explicitly chosen or custom chord-label text subject to the recognition validity rules. Automatic display spelling must not silently replace the composer's chosen interpretation.

### Editing meter preserves the music's timing

- Creating, changing, moving, or removing a meter marker rebuilds measure boundaries around the existing note timeline. Note starts, durations, and pitches remain unchanged.
- Keep existing later context markers at their musical positions. A later meter marker starts another measure at its own position, even if that leaves a short preceding measure.
- For example, start in 4/4 and insert 3/4 at quarter-note position 2, the original measure's beat 3. The opening measure covers positions 0–2. New 3/4 measures begin at positions 2, 5, 8, and so on until another meter marker. A note at position 4 stays at position 4.
- Show a short measure's actual duration. Do not invent a new time signature for it, pad it with extra time, or move notes to fill it.
- Preserve existing box boundaries where they remain valid and split boxes at new measure boundaries when needed. Boxes must still partition each measure; changing their grouping does not change note timing.
- This is distinct from inserting or deleting a whole measure, which adds or removes musical time under the previously agreed editing rules.

### Context during insertion and deletion of measures

- Inserted measures inherit the settings immediately before the insertion point. At the song's start, use the project's initial settings. The inherited meter determines the inserted measure's duration.
- Move existing later context markers with their music, including markers originally located exactly at the insertion point. For example, inserting before a change from 4/4 to 3/4 adds a 4/4 measure and moves the 3/4 change later.
- When deleting a measure, preserve the effective key, meter, and collection of the surviving music at the join. Remove markers inside the cut and shift later markers with the surviving timeline; restore the effective setting at the join if losing a marker would otherwise change that music's context.
- For example, if G major began in the deleted measure and continued afterward, the surviving passage still begins in G major. This may require a replacement marker at the join. If deleting from the beginning, the surviving passage's context becomes the initial context.
- This does not change the agreed note-deletion rules: remove notes whose starts are deleted, shorten earlier held notes by the removed portion, and shift later starts earlier.
- Undo/redo must restore both the music and its context markers.

### Context boundaries and chord labels

- A key or harmonic-collection change divides the scope of a chosen label, even if the sounding bass/chord pitches remain the same. The composer can choose a new interpretation after that boundary without renaming the earlier passage.
- An existing valid label can carry forward into the new context until the composer changes it. Context changes do not alter the pitch-based matching rule or the agreed preference for an exact match rooted in the actual chord bass.
- A meter change alone does not divide label scope. Splitting or resizing boxes alone does not divide it either.
- This refines the harmony-span rule in [Define chord recognition and voicing tools](02-chord-recognition.md). Labels remain interpretations; they do not rewrite notes.

### Acceptance scenarios and evidence limits

The following are future application checks:

1. Changing the song key from C major to G major leaves existing pitches, timing, and the explicitly selected C major sixth-diminished collection unchanged.
2. Changing from C major to C minor sixth-diminished changes E from a sixth-chord tone to an outside tone, makes E♭ a sixth-chord tone, and leaves the diminished family unchanged.
3. A held E changes from the sixth-chord family to the diminished family when the collection changes from C major to F major sixth-diminished. Playback sustains the same E without a new note attack.
4. Inserting 3/4 at position 2 of a 4/4 passage yields the short opening measure and new boundaries described above, with identical note-on and note-off times before and after the edit.
5. Deleting a measure where a key or collection change began preserves the context of surviving music at the join. Undo restores the original notes, measure layout, and markers.
6. A new label chosen after a key or collection change does not rename a held harmony before that change. A meter-only change leaves that label scope intact.
7. A♭ and G♯ refer to the same sounding pitch and receive the same family color in the same collection. Keyboard labels remain practical and do not require double accidentals.
8. Moving between editing and playback changes the keyboard's context source as specified, with the active collection visibly named and family membership readable without color alone.

An arithmetic check confirmed that all 24 supported collection transpositions contain disjoint four-note families and verified the E examples above. That check validates pitch-set definitions only; no application, audio playback, meter editor, or accessible color palette has been tested. The [context ADR](../../../docs/adr/0002-independent-musical-context.md) records why these settings are independent of the written notes.
