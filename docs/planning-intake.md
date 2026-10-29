# Song composition website: planning intake

Updated October 27, 2026.

## Agreed destination

Produce an agreed specification for a working, playable website the owner would use to compose and arrange songs on a desktop. Define the writing workflow, chord-box behavior, rhythm rules, Barry Harris colors, playback, saving, and release boundaries. Adaptation for mobile comes later.

The owner first accepted a specification for personal use, then agreed to the first scope recommendations with one change: build for desktop web before mobile. The detailed scope is still open. This document records the agreed baseline and starting brief; it is not yet a complete implementation specification.

## Requested experience

These are requests from the initial brief, not a claim that all are required in the first release.

- Create a project containing measures.
- Set an initial song key and time signature, with changes during the song.
- Start with common time signatures; the exact set remains open.
- Place visual chord boxes with musical durations, such as quarter, half, and whole notes.
- Give each box bass, melody, and chord parts.
- Start each box empty and let the composer choose its actual notes.
- Recognize chord names from those notes.
- Support choices involving chord quality, inversions, voicings, and drop 2.
- Show a color-coded MIDI visualizer at the bottom of the app.
- Distinguish the sixth-chord notes from the associated diminished notes in a Barry Harris collection. The supplied example combines C–E–G–A with D–F–A♭–B.

## Agreed baseline

Accepted by the owner on October 27, 2026, in response to questions Q2–Q8:

- **Creative control:** the composer writes the progression, bass, and melody. The app identifies chords and provides explicit editing operations. Automatic musical generation is outside the first version.
- **First device:** a working, playable website for desktop use. Mobile adaptation follows later; a phone platform is not the first target.
- **Time inside a chord box:** the box defines a time span. Bass, melody, and chord notes can have independent starts and durations within it.
- **Context changes:** a key change can occur at a chosen musical position. A time-signature change starts a new measure, including when inserted inside an existing measure. The handling of existing notes still needs a decision.
- **Visualizer:** a playable piano keyboard with colored keys, used to enter and hear notes. External MIDI device support remains a separate scope question.
- **Harmonic colors:** a selected Barry Harris collection controls the colors and can differ from the song key. Sixth-chord tones and diminished-chord tones have distinct colors. Notes outside the collection remain available and use a neutral appearance.
- **Complete writing session:** write a passage, hear it with a built-in piano sound, loop selected measures, and save and reopen without an internet connection. MIDI export is not yet decided.

## Unresolved detail

The [decision map](../.scratch/song-composer/map.md) now indexes the planning effort. Its child tickets hold the open questions about timing, recognition, musical context, browser feasibility, project recovery, interaction design, implementation approach, and release acceptance.

## Musical evidence that affects later decisions

The existing [harmony guide](../barry-harris/BARRY-HARRIS-HARMONY.md) and [lesson transcript](../barry-harris/VIDEO-TRANSCRIPT.md) supply the following planning context:

- Song key and the collection used for harmonic movement can differ. The transcript's application to a ii–V in G uses C major sixth-diminished material for Am7.
- C6 and Am7 share the pitch classes C, E, G, and A. Chord recognition therefore needs a policy for alternative names and composer intent.
- The C major sixth-diminished collection combines C–E–G–A and B–D–F–A♭. The user's D–F–A♭–B gives the same sounding pitches. Strict D°7 spelling would use C♭ instead of B.
- Drop 2 depends on pitch register. The transcript introduces it for four-note voicings by lowering the second-highest note by an octave; behavior for arbitrary user-selected notes remains undecided.
- A melody can stay on one note while an inner chord voice moves. Bass, melody, and chord changes need not coincide musically.

These points were read from the local material. This planning pass did not independently check the underlying recordings or external sources.

## Planning records

Use Wayfinder's local Markdown tracker because this repository has no configured external tracker. The decision map is `.scratch/song-composer/map.md`, with one question per child file in `issues/`. Do not mark unanswered decisions as resolved.

Keep app terms in the root [glossary](../GLOSSARY.md). The [Barry Harris glossary](../barry-harris/GLOSSARY.md) remains the reference for the existing study material. Create an ADR only when an agreed decision involves a substantial trade-off that would be costly to reverse.
