# Test the desktop composition workspace

Parent: [Plan a playable desktop song composer](../map.md)
Labels: wayfinder:prototype
Type: prototype
Status: claimed
Assignee: owner-and-codex
Blocked by: 01, 02, 03, 04

## Question

Can the owner comfortably enter, hear, inspect, and revise a short musical phrase using measures, chord boxes, independent parts, and the bottom piano keyboard on a desktop?

Use a disposable interaction prototype after the musical rules are settled. Test selection of a part and time position, note entry and removal, durations and registers, navigation among boxes, chord-name alternatives, context changes, playback and looping. Include a held bass under a moving melody and an inner voice changing while the melody holds. Expose the relevant state and collect the owner's reaction; the prototype cannot resolve its own usability verdict.

## Working notes

October 28, 2026: the owner requested continuation with TDD and Grill with Docs. The explicit TDD request overrides the Prototype skill's default of skipping tests. Scope and public test seams were agreed before writing tests, followed by one failing test and its minimal implementation per cycle. The artifact and later revisions are recorded below; final usability acceptance remains open.

### Accepted prototype scope

The owner accepted Q43–Q44 on October 28, 2026:

- Build a local, playable, disposable interaction prototype with a blank composition and short guided examples.
- Cover note entry/editing, independent parts and sustains, box split/merge, chord-name alternatives, key/meter/collection changes, playback, loops, and undo.
- Use in-memory state and clearly identified temporary synthesized sound. Full project saving, MIDI export, the complete voicing toolbox, and the final piano sound remain first-release work after the interaction is validated.
- Use a horizontal timeline of measures and chord boxes, with aligned Melody, Chord, and Bass rows. Show note starts, lengths, and continuations. Place selection controls beside the timeline and the colored keyboard at the bottom.

### Agreed test seams

The owner accepted Q45–Q46 on October 28, 2026 and confirmed these seams and the interaction as the build agreement.

1. **Editor commands and inspection:** a small public composer interface accepts editing actions and returns readable composition state at a position. Automated tests cover independent note timing, box changes, context changes, recognition, and undo. They do not establish that the screen is understandable or that audio sounds correct.
2. **Playback plan:** a public function returns the timed note spans for a requested song or loop segment. Automated tests cover starting inside a sustain, release at the segment end, and repeatable loop timing. They do not establish speaker latency, browser scheduling under load, or piano quality.
3. **Visible browser controls:** direct browser checks exercise note entry, selection, editing, playback controls, and displayed context. They catch disconnected controls and visible state errors. They do not replace the owner's judgment of musical comfort or listening tests.

Use red → green cycles for the two automated seams, one behavior at a time. Exercise the visible controls after each usable slice. The owner's response to the working prototype remains necessary before this ticket can be resolved.

### Entry and correction

Piano clicks add notes at the selected part, position, and duration without advancing the position. Next step advances by the chosen duration. Clicking a timeline note selects it; the side panel edits its pitch, start, or duration, with an explicit Delete action. Undo supports corrections.

### Prototype design and implementation

Use a self-contained HTML file in `prototype/`, with plain JavaScript and no build dependencies. The two automated seams are the public composer commands/inspection and a public playback-plan function. Node's built-in test runner exercises the actual inline logic, without mocking its collaborators. The browser check uses the visible page.

Use a pale blue-grey workspace (#edf2f6), white writing surface (#ffffff), dark blue text (#243747), teal sixth-chord tones (#16736a), violet diminished tones (#7555a1), and neutral slate outside tones (#667581). Keep focus and selection distinct from note-family color. Use the installed system sans-serif stack for controls and tabular numerals for musical time. The timeline is the main surface; avoid a dashboard of cards. Align Melody, Chord, and Bass vertically at each time, with a compact side inspector and bottom keyboard. Include symbols and labels with the colors. A separate walkthrough/state area makes the musical behavior inspectable.

The design is for testing musical interaction, not choosing final branding. Prototype state is disposable and the sound is temporary; both limits must stay visible.

### First working artifact and requested edits

The first self-contained [prototype](../prototype/index.html) is built. Twelve behavior tests pass at the two agreed automated seams. The local HTTP preview returned 200. Browser inspection was blocked by automatic approval review because its usage limit was reached; no visual or audible validation is claimed.

The owner tried the open preview, said they liked it, and requested another iteration: left-button dragging to set note length with snap, musical length controls without decimal-quarter stepping, a toggleable metronome, one Play/Pause button in place of the three transport buttons, and a piano note-name toggle. Continue TDD at the agreed seams and settle the interaction details before editing. This feedback is not final acceptance of the prototype.

Scope of the next tests: extend editor-command/inspection coverage for one snapped resize and undo; extend playback-plan coverage for metronome pulse positions and accents. Visible drag gestures, the combined transport control, and piano-name visibility remain browser checks. These are extensions of the existing agreed seams, not tests of private helpers.

### Accepted first revision

The owner accepted Q47–Q50 on October 28, 2026:

- Drag a visible right-edge handle with the left mouse button to resize one note. Preserve its start, pitch, and part. Show a snapped preview without changing the composition until release; the completed resize is one undo step. Escape or a cancelled pointer gesture discards the preview.
- Snap duration from the note's own start. Offer Quarter, Eighth, Sixteenth, and Eighth-triplet grids, initially Sixteenth. Keep at least one snap unit. Crossing a box or measure boundary remains allowed; normal note-extension rules apply.
- Replace the selected-note decimal length field with named musical duration choices. A dragged duration outside those choices is displayed as an exact fraction of a whole note, such as 5/16. The entry duration choices remain available.
- Add an optional metronome, initially off, active only during playback. Accent the first beat of each measure; click quarter notes in 2/4, 3/4, and 4/4, and dotted quarters in 6/8. Follow actual measure boundaries and meter changes. Clicks are separate from composition notes. Count-in is deferred.
- Replace separate Play, Pause, and Stop controls with one Play/Pause toggle. Play resumes the paused position. Choosing a timeline position pauses and sets the next start. With looping enabled, a position inside the selected loop is honored; otherwise playback starts at the loop's beginning. Reaching the song end returns to the editing position. This revises the original three-control presentation from ticket 01.
- Add the requested piano note-name toggle, initially on. Hiding printed pitch names leaves family symbols, family colors, hover information, and accessible names available. This is a session display preference, not a musical edit.

Keep the same agreed test seams. The revision still needs the owner's trial and browser/audio verification; do not treat the initial positive reaction as acceptance of later changes.

### Revision evidence

The first revision is implemented in the [self-contained prototype](../prototype/index.html), with [usage and test instructions](../prototype/README.md). All 15 behavior tests pass, including snapped resize preview/commit/undo, musical duration readouts, and metronome pulses across meter changes. Both script blocks compile, and static source checks found no duplicate IDs or stale literal element references. Those source checks did not execute browser behavior.

Automatic approval review still prevents browser inspection because of its usage-limit error. Live pointer behavior, rendered layout, audio output, and the combined transport interaction have not been verified by the agent. The owner has been asked to try the revision in Q51; this ticket remains claimed pending that response. The local preview is retained for that requested trial. No production site was deployed, and no Git capture was made because the repository still has no commits or remote.

Q51 initially returned “site cant be reached,” so it does not accept or reject the musical interaction. The former preview process session was absent, and an HTTP check reproduced connection refusal. The same loopback-only Python preview was restarted in an independent process for the owner's trial. This is a preview-lifetime repair, not a composition-code change; browser and audio verification remain open.

### Second revision: direct manipulation and harmonic degrees

The owner tried the restored preview and requested right-click note deletion, dragging note bodies in time, a draggable orange editing cursor, Roman numerals beside sounding harmony and inside boxes, larger harmony labels, and measure/meter labels below the notes. This is further iteration, not final acceptance.

Q52–Q54 are accepted:

- Dragging a note body moves its start on the selected rhythm grid, preserving its part, pitch, and duration. Show a preview; commit one undo step on release. Allow movement across boxes and measures, extend the song as needed, and leave other notes untouched.
- Dragging the orange editing cursor pauses playback. Snap to nearby note starts and ends, otherwise to the selected rhythm grid. Update displayed harmony and keyboard context while dragging; do not edit music or add an undo step.
- Show larger chord names and Roman numerals at harmony or local-key changes inside each box, including between beats. Do not repeat an unchanged label on every beat. Move measure numbers, time signatures, and beat marks below the notes.

Right-click deletes the complete clicked note using the existing undoable delete action. The side-panel Delete action remains available.

Q55 completes the build agreement. Roman numerals use the tonic's major scale as the degree reference in both modes: E♭ and A♭ in C minor are ♭III and ♭VI. Letter case follows chord quality. Sixth chords use `(add6)` to distinguish chord content from classical figured-bass inversion symbols. Use the chosen valid recognized interpretation, otherwise the suggested match; custom labels and unmatched sets have no automatic numeral. The adjacent chord name carries any slash bass. Use the key active at the exact position, independently of the collection. Automatic functional analysis such as V/V is deferred.

This is an explicit display convention. Key-relative minor numerals also exist; see [Roman Numeral Chord Symbols](https://musictheory.pugetsound.edu/mt21c/RomanNumeralChordSymbols.html). The major-reference convention is described in [Temperley's research, footnote 1](https://mtosmt.org/issues/mto.11.17.4/mto.11.17.4.temperley.html). [Figured bass](https://viva.pressbooks.pub/openmusictheory/chapter/figured-bass/) explains why classical I⁶ has a different meaning from an added-sixth chord.

Continue TDD through the agreed editor-command/inspection seam for snapped moves, cursor position resolution, and key-relative harmony labels. The DOM handlers, label placement, and pointer gestures remain visible-browser checks. Changes reach the core commands/inspection, timeline and inspector rendering, pointer handlers, behavior tests, and usage notes; no persistence or export changes are involved.

### Second revision evidence

The second revision is implemented. Twenty behavior tests pass, with red → green cycles for snapped note moves and undo, cursor snapping without musical edits, and Roman numeral context, quality, and interpretation rules. Right-click deletion uses the existing tested delete/undo command. The bottom ruler, larger harmony labels, cursor handle, note-body gestures, and scrolling near the viewport edge are wired in the UI. Both script blocks compile and static element-reference checks pass.

The existing local preview returned HTTP 200. Automatic approval review's earlier usage-limit rejection still leaves browser gestures, layout, and audio unverified by the agent; source and model checks do not prove those behaviors. Ask the owner to reload and try the second revision in Q56. Reloading clears scratch notes. Keep the ticket claimed until the owner accepts the interaction.

### Third revision: simpler controls, melody entry, and secondary dominants

The owner liked the second revision and requested removal of the status text beside Play/Pause, entry controls below the timeline, a separate piano-symbol toggle, automatic cursor advancement for melody entry, and secondary-dominant interpretations.

Q57–Q58 are accepted:

- An Advance after entry preference defaults on for Melody and off for Chord and Bass, remembered separately for each part during the session. A successful piano entry advances to the note's exact end, including across measures. Turning it off allows simultaneous notes in that part. During playback, the piano still auditions only.
- Secondary-dominant labels are explicit alternatives to the ordinary Roman numeral. Choosing one changes the inspector and timeline labels without changing notes or key. Scope follows the harmony passage; selection is undoable and unsuitable choices receive a review notice after edits. Candidate coverage is the remaining interview question.

The requested layout edits and symbol toggle need no further product decision. Symbols default visible and toggle independently of note names; colors, legend, tooltips, and accessible names stay available. Remove the redundant transport text and its updates, and place entry controls beside the box tools below the timeline. Automated additions stay at the agreed editor-command/inspection seam; visible placement and toggles remain browser checks.

Q59 completes the build agreement. Offer secondary interpretations for recognized major triads and dominant 7, 9, and 7♭9 qualities. Targets are the key's diatonic major/minor triads excluding the home tonic and diminished targets; minor keys also include the common major V target alongside minor v. Keep the ordinary degree as the default. Do not require the next chord to resolve to the target, and defer nested chains such as V/V/V. Invalidated choices remain visible for review while the active display falls back to its valid ordinary degree.

The candidate rule follows [Open Music Theory's tonicization explanation](https://viva.pressbooks.pub/openmusictheory/chapter/tonicization/); extensions retain the dominant core described in [chord symbols](https://viva.pressbooks.pub/openmusictheory/chapter/chord-symbols/). The target pool and explicit choice are product limits, not a complete analysis of minor harmony. [Irregular resolutions](https://musictheory.pugetsound.edu/mt21c/IrregularResoltionsOfSecondaryDominants.html) support retaining an interpretation without forcing a following target chord.

### Third revision evidence

All requested third-revision changes are implemented. Twenty-five behavior tests pass. New red → green cycles cover advancing melody step entry, exact triplet positions across measures, fixed entry, major/minor secondary-dominant candidates, chosen interpretation scope and undo, invalid-choice rejection, and review after note/key changes. Returning to the ordinary degree clears the secondary choice and follows later key changes.

Both script blocks compile. Static checks confirm consistent element IDs/references, removal of the redundant transport status, and entry controls after the timeline. HTTP returned 200, and the served page's hash matches the current artifact. The revised controls and layout have not been visually or audibly verified by the agent because of the earlier automatic approval review usage-limit rejection. Q60 requests the owner's trial; this ticket remains claimed.

### Fourth revision request: broader harmonic interpretations

The owner requested broader secondary dominants, Roman numeral inversions, tritone substitutions, diminished interpretations, and modal interchange, referring to [this video](https://www.youtube.com/watch?v=l_gV-2jU7zE). This expands the prior candidate limits and inversion display policy. The accepted boundaries and implementation evidence follow below.

Design frontier:

- Establish what the linked video actually demonstrates and what evidence can be accessed.
- Define secondary and substitute-dominant target coverage, including chromatic targets and any limit on nested interpretations.
- Choose inversion notation for triads/sevenths and an unambiguous display for added-sixth and extended chords.
- Distinguish leading-tone diminished candidates from passing and common-tone roles that depend on surrounding music.
- Define parallel-mode sources and how to show several possible borrowing sources for one chord.
- Keep the previous composer-selected interpretations, undo, mismatch review, independent context, and unchanged written notes unless explicitly revised.

The current 25 behavior tests still pass. New implementation remains under the existing editor-command/inspection and visible-control test seams after the decisions are settled.

Q61 is accepted: expand applied interpretations to major/minor targets on all twelve pitches, with one level of interpretation rather than nested chains. Keep composer choices and the existing recognized vocabulary unless revised below.

Q62, Q64, and Q65 are accepted:

- Roman triad inversions use 6 and 6/4; seventh inversions use 6/5, 4/3, and 4/2. Derive them from the selected root/quality and actual lowest bass/chord note, not the part name. Preserve added-sixth, suspended, and extended quality labels with an explicit bass note where standard triad/seventh figures do not apply. Include an explanation for compact figures.
- Add leading-tone interpretations for diminished triads, fully diminished sevenths, and half-diminished sevenths. Keep alternative diminished roots selectable. Mark half-diminished leading-tone readings as less usual. Passing and common-tone roles remain explicit custom labels.
- Compare with seven parallel modes: Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, and Locrian. Show all compatible sources as possible interpretations; choosing one records intent without changing key or collection. Suppress redundant borrowing suggestions when the chord already belongs to the active major/natural-minor scale. Other collections remain deferred.

Q63 accepts optional substitute-dominant readings toward a major/minor target a semitone below the chord root, including the home tonic. The owner added an octave limit. Q66 below resolves whether that limit refers to chord qualities or actual voicing range; written notes remain preserved.

Q66 resolves that limit: recognize triads, sus2/sus4, sixths, and sevenths, and allow open voicings. Remove ninths, 6/9, and 7♭9 from automatic recognition and the interpretation candidates; preserve all written pitches and registers. This supersedes the extended-quality subset of Q22/Q59 and completes the fourth-revision build scope. The home tonic remains an ordinary dominant destination rather than a secondary one; it remains available for tritone substitution and ordinary leading-tone interpretation.

The video metadata findings and retrieval limits are recorded in [Harmony video reference](../../../docs/research/harmony-video-reference.md). The second research agent stopped when its network permission was revoked, before saving a detailed theory report. Do not describe that unfinished report or the video transcript as reviewed evidence.

### Fourth revision evidence

All agreed fourth-revision features are implemented. Thirty-two behavior tests pass through the existing public editor-command/inspection and playback-plan seams. Red → green cycles cover triad/seventh inversion figures, the reduced recognition vocabulary with open voicings preserved, explicit bass names for sixth/suspended chords, chromatic secondary targets, tritone substitutes, alternative diminished roots, and modal-source selection with undo and context review. The modal fixture was corrected to include Locrian for Fm: C Locrian contains F, A♭, and C.

The inspector groups choices by interpretation type and explains the selected reading. The same chosen numeral/source appears inside timeline boxes; label tooltips explain compact inversion figures. Recognition now uses the 14 agreed qualities. The glossary, recognition ticket, map, and prototype usage notes reflect Q66. No existing note is removed, folded into one octave, or transposed by these choices.

The next owner trial is Q67. Keep this ticket claimed until the owner accepts the interaction. Reloading the prototype clears its in-memory scratch composition. Visual controls and audio still require direct trial because automatic approval review previously blocked browser inspection with a usage-limit error. No transcript or detailed examples from the reference video were verified.

Final source checks: both script blocks compile; all 65 element IDs are unique and literal element references resolve. The local preview returned HTTP 200, and its SHA-256 matched the updated artifact (`d96106e34b9661916f4a6d87437d938cd9e55bf32e9cdf8108456ce217f0f37c`). These are source and delivery checks, not rendered-browser or audio validation.

### Fifth revision: silent preview and compact display

The owner liked the fourth revision and requested silent piano highlights at the orange cursor, independent collapse buttons for the three part rows, stacked inversion figures matching the supplied image, and optional key labels beneath chord boxes. Q68 confirms cursor-based preview only; ordinary mouse hover does not change the preview.

The revision uses these rules:

- Highlight the registered pitches active in all three parts at the editing cursor while stopped, including exact note starts and held notes, excluding exact note ends. No playback or audition is triggered. During playback, highlights follow the playhead. Notes outside the visible keyboard range remain reachable with the octave controls.
- Collapse Melody, Chord, or Bass across the timeline using its header button. Leave a short header with a note count and an Expand control. Collapsing changes visibility only; notes keep playing and remain part of harmony and piano inspection. Preferences persist within this page session and do not enter musical undo.
- Stack inversion pairs vertically with no slash or horizontal fraction bar in the inspector and timeline. Single figures are raised. Preserve the slash before the target in V/IV and similar readings, and preserve explicit added-sixth labels. Native menu options and accessible descriptions use text such as “6 over 4.” Stored interpretation names keep their existing identity.
- Add Key labels: On/Off beside the box tools, initially on. It controls the local key text beneath all chord labels and reduces their row height when hidden. The inspector still shows the key; neither markers nor Roman analysis change.

Scope reaches the core inspection display data, timeline and piano rendering, row/toggle handlers, CSS, behavior tests, glossary, and usage notes. The previously agreed test seams still apply. No new storage, export, audio scheduling, or composition-edit command is needed.

Thirty-four behavior tests pass. Roman display data was implemented with a red → green cycle through composer inspection, including all inversion pairs, secondary/substitute targets, modal sources, added sixths, and custom labels. A cursor-boundary regression passed before the UI change, confirming that the existing model already supplied the needed active notes without changing the composition or undo. Removing the playback-only UI guard makes that information visible while stopped. Both scripts compile and source ID/reference checks pass.

Direct checks of the rendered figures, collapse buttons, key-label toggle, piano highlights, and audio remain unverified by the agent because automatic approval review previously blocked browser inspection with a usage-limit error. Q69 will ask for the owner's trial. Keep this ticket claimed; positive feedback on an earlier revision does not approve this one. Reloading clears the scratch composition.

The fifth-revision delivery check found the local preview stopped. It was restarted on the same loopback-only address. HTTP then returned 200, and the served SHA-256 matched the artifact (`427f48be2149d157a4206c6c32698fe2fb8ed55915651654c22f7f51a15a9059`). This verifies delivery, not browser rendering.

### Fifth-revision follow-up: figure alignment and piano duration

The owner's screenshot showed that paired inversion figures sat below the intended position, while single superscript figures were acceptable. The shared paired-figure style now uses an inline block whose last line supplies the baseline, aligning the lower digit with the Roman numeral. Single figures retain their previous style. This reaches both timeline and inspector through the existing renderer; chord identities and inversion calculations are unchanged.

The owner also requested a default duration control for piano entry. A Default duration menu beside the piano mirrors the existing timeline Note duration menu. Both use the existing musical choices and one session value, initially Quarter. Changing either controls the duration of subsequent piano notes and the existing next-step/advance behavior. The choice survives part changes, new blank compositions, and example resets during this page session; a page reload resets it. Editing an existing note does not change the default or any other written note.

All 34 existing behavior tests pass, and both scripts compile with consistent source IDs and literal element references. These changes are in CSS and control wiring; the tests do not prove rendered alignment or menu interaction. The supplied screenshot provides the observed visual failure, but direct browser verification remains unavailable after the prior automatic approval review usage-limit rejection. No mock rendering test was added or claimed as visual evidence. The owner's next trial remains the alignment check; this ticket stays claimed.

The preview returned HTTP 200 and its served bytes match the updated artifact.

### Quarter-triplet duration

The owner requested quarter-note triplets. Quarter triplet is now included in the shared duration choices used by the piano default, timeline entry, and selected-note menus. Its duration is two-thirds of a quarter note; three fill two quarter-note beats. The existing 24-tick timing grid already represents it exactly. Snap options are unchanged. The duration-label test first failed with a generic 1/6-whole-note label, then passed after the shared choice was added. All 34 behavior tests pass; both scripts compile. HTTP returned 200 and the served bytes match the artifact. Live browser interaction remains unverified under the existing browser-inspection limitation.

### Sixth revision: piano deletion, same-pitch overlap, and snap

The owner requested piano-key right-click deletion, no duplicate simultaneous notes, Quarter as the default snap, Quarter triplet snap, and removal of Sixteenth snap. Q70 confirms that the same-pitch restriction and piano deletion apply within the selected part, preserving independent Bass, Chord, and Melody roles.

- Reject new notes, pitch/start/duration edits, and move/resize previews or commits that overlap the same registered pitch within that part. Compare integer timing ticks so adjacent triplets remain allowed. Rejection preserves music and undo history. Do not silently replace, merge, shorten, or discard existing notes. Equal pitches in other parts and octave-separated pitches remain allowed.
- Right-clicking a piano key deletes the complete note of that pitch active at the orange cursor in the selected part. Include held notes, include exact starts, and exclude exact ends. A matching deletion pauses playback, preserves the editing position, and creates one undo step. No match displays an explanation and makes no musical edit. Existing direct timeline deletion remains available.
- Snap now defaults to Quarter and offers Quarter, Eighth, Quarter triplet, and Eighth triplet. Remove Sixteenth only from snap; sixteenth note durations and written notes remain supported. Seeking, moving, resizing, and cursor-arrow navigation use the selected grid.

Scope reaches command validation and inspection, drag preview/error handling, piano context-menu handling, snap options, behavior fixtures, and documentation. TDD uses the previously agreed public editor-command seam. Four red → green cycles verify overlap rejection and adjacent triplets, collision rejection during drag previews, part/position-specific deletion and undo/no-op behavior, and quarter-triplet snap across all three commands. An old duration-label fixture used overlapping equal pitches; its note positions were separated while preserving the label assertions. Existing snap tests now use supported grids.

All 38 behavior tests pass. Both scripts compile and source ID/reference checks pass. Browser pointer/menu and audio behavior remain unverified by the agent after the earlier automatic approval review usage-limit rejection. The ticket remains claimed pending owner trial.

The sixth-revision delivery check found the preview stopped. After restarting the same loopback-only server, HTTP returned 200 and the served bytes matched the updated artifact.

### Seventh revision: box selection, part volumes, and playback highlight

Q71–Q72 accept click/Ctrl-or-Cmd-click/Shift-click box selection and one volume slider for each of Melody, Chord, and Bass throughout the song. The owner also requested highlighting the chord box itself during playback.

- Click any harmony label inside a box to select that whole box and inspect its position. Ctrl/Cmd-click toggles boxes; Shift-click selects the inclusive range from the selection anchor. Purple outlines and a count identify selection. An explicit Clear box selection button restores the existing cursor-based key control. Selection persists through ordinary cursor movement; changed box boundaries remove stale selections.
- Applying a key to selected boxes changes only those spans. Replace internal key changes there, merge adjacent selected spans into one region, restore the original key at each region's end, and preserve unselected gaps and later markers. Restoration at the current song end also protects music added later. Notes, collection, meter, and box boundaries stay unchanged. One Undo restores the entire key edit. With no selection, key changes still apply from the cursor until the next key marker. Collection and meter remain cursor-based controls.
- Add a 0–100% volume slider to each part header, initially 100%. Sliders remain visible when collapsed and work during playback, including held notes. Route each part through its own audio gain; auditions use the chosen part, while the metronome retains its own route. Volume preferences survive new blank compositions during this page session and remain outside musical undo. A 0% part remains represented in the written harmony and visual highlights.
- Highlight every header segment of the currently playing box with a green fill, top rule, and play symbol. Selection retains its purple outline. Advance on exact box boundaries, including empty boxes, split boxes, loops, and meter changes. Clear the playing highlight when playback pauses or ends.

Scope reaches the public key-edit command and current-box inspection, timeline selection/rendering, key-control scope text, audio routing and part sliders, behavior tests, glossary, context ticket, and usage notes. TDD remains at the agreed command/inspection seam. Red → green tests verify bounded key changes with disconnected selections and invalid-input rejection, and current-box boundaries through silence and context changes. A further regression verifies merged adjacent selections and context restoration for later extension. All 41 tests pass; both script blocks compile and source ID/reference checks pass.

The slider wiring and live audio gains, rendered selection gestures, and playback highlight have not been directly verified in the browser because automatic approval review previously rejected browser inspection with a usage-limit error. Model tests do not establish these behaviors or listening quality. Q73 requests an owner trial; keep the ticket claimed. Reloading the preview clears scratch notes.

The seventh-revision preview returned HTTP 200, and its served bytes match the current artifact. This verifies delivery, not live browser interaction.

### Eighth revision: note groups and clearer playback

Q74 accepts Ctrl/Cmd-click or Shift-click to toggle notes in a selection, including across parts. The owner also requested removal of box play symbols, Half as the initial Chord entry duration, a visible piano-entry part, 5% volume increments, and automatic scrolling during playback.

- Drag any selected note body to move the entire selection by one time offset. Snap the dragged note's start; retain every member's relative spacing, pitch, part, and duration. Drag its right edge to add or subtract the same duration from all selected notes, snapping the dragged note's length from its own start. A preview shows all affected notes; release commits one undo step, and Escape cancels.
- Validate the complete resulting note set before committing. Reject the entire edit if any note becomes nonpositive in length, starts before zero, exceeds 256 quarter notes, or overlaps the same registered pitch within its part. Check selected notes against their new positions, so a valid group move is not blocked by members' old positions. Invalid previews have red outlines and an explanation. Single-note side-panel editing remains available; a multiple selection shows group instructions instead.
- Clicking an unselected note selects it alone; dragging a member of the existing selection keeps the group. Empty timeline space clears the note selection. Selection is a page-session UI state, outside musical undo. Direct right-click deletion still removes only the clicked note; remaining selected notes stay selected.
- Chord entry starts at Half; Melody and Bass start at Quarter. Remember duration separately for each part through part switches and new blank compositions. Both duration menus stay synchronized to the active part. Editing a written note does not replace this preference. Reloading restores defaults.
- Highlight the active piano-entry lane in amber and show a Piano entry badge, including when collapsed. Part changes, lane clicks, and timeline note selection update it. Selecting notes across parts does not make the piano enter into several parts at once.
- Part volume sliders use native 5% steps. Playing box headers retain their green fill and top rule without a play glyph.
- Follow playback when it approaches or passes the viewport edge, placing the playhead near the left side. Smooth scrolling also follows loop returns; reduced-motion preferences use immediate scrolling. Avoid restarting the scroll every playback tick, and stop automatic motion on pause or editing.

Scope reaches the existing move/resize command, final-state overlap validation, note selection and drag handlers, previews and inspector, per-part entry controls, lane styling, native volume controls, transport scrolling, tests, and documentation. No dependencies, storage, export, or production architecture changes were added.

Two red → green cycles cover group movement and resizing through the agreed command/inspection seam. Tests verify cross-part spacing, snap anchors, unchanged unselected notes, non-mutating previews, one-step undo/redo, song extension, invalid selections and bounds, collisions with selected and unselected notes, and exact adjacent boundaries. All 43 behavior tests pass. Both script blocks compile; all 71 source element IDs are unique and literal references resolve. Static checks also confirm the part defaults, native 5% step, and removed box play glyph.

The local preview returned HTTP 200 and its bytes match the current artifact (SHA-256 `d0cd64df6ef49101f9f74f2f18d42dae4d625a7b99f867dcfd01f5e873d1de5f`). Direct browser pointer interaction, rendered highlights, smooth following, and audio remain unverified by the agent after the earlier automatic approval review usage-limit rejection. These source and model checks do not replace the owner's trial. Keep this ticket claimed pending acceptance; reload clears the in-memory scratch notes.

### Ninth revision: earlier playback following and stronger audio

October 29, 2026: before continuing the separate mobile plan, the owner requested earlier scrolling to show the next chord, removal of purple box selection when playback starts, and higher note volume. These changes are authorized directly by that request; the musical model and mobile decisions are unchanged.

- Start following at 65% of the visible timeline width, rather than within 32 pixels of its right edge. Also check the next box near its boundary, using a lookahead window of one quarter note or 0.75 seconds, whichever is longer, to make room for its label when clipped. Do not anticipate a box beyond the playback/loop end. Retain smooth scrolling, reduced-motion handling, song-bound clamping, throttling, and loop-return following.
- Clear selected boxes and their selection anchor only after playback settings and plans validate. Refresh the displayed selection count and key-edit scope before audio begins. Pausing does not restore a hidden selection. Notes, context markers, and musical undo remain unchanged.
- Raise ordinary note attack/sustain gains from 0.085/0.035 to 0.255/0.105 for both piano auditions and written-note playback. Preserve part slider ranges and the metronome's pre-compression level. Route the master through the browser's native dynamics compressor (threshold −6 dB, ratio 20:1, zero knee, 3 ms attack, 100 ms release) to control dense peaks. This is a temporary synth adjustment, not a measured final piano calibration or a guarantee against all distortion.

Scope reaches playback startup, the existing live-position inspection and scroll calculation, native audio output wiring, and usage/evidence documentation. No new dependency, musical command, persistence, or mobile implementation was added.

#### Browser evidence at the agreed visible-control seam

Browser access succeeded in this revision. Tests used a separate disposable tab; the agent did not reload the owner's original composition tab.

1. **Selection red → green:** select a box and start Play. Before the change, the box retained its purple outline, pressed state, and selected-box key scope. Afterward the selected count and pressed-box count were both zero, and the key control returned to the cursor scope.
2. **Early scroll red → green:** use five 4/4 measures, a C chord at quarter position 12 and an F chord at 16, Whole duration, Zoom 60, BPM 40, and start playback at 14 with horizontal scroll zero. Before the change, the playhead was at 846.507 px while the next chord started at 960 px beyond a 946 px viewport; scroll remained zero. After the change, the next chord and 160 px of its label area were visible while the playhead was still before 960 px. The final audio build also passed this check with scroll 288 px, viewport 912 px, and playhead 919.467 px.
3. **Loop return:** loop all five measures at BPM 120 starting at quarter position 19.5. The browser returned to box `0:4` and scroll zero. The written-note table was identical before and after playback.
4. Piano auditions and playback exercised the new audio route without browser console warnings or errors. This establishes successful execution, not perceived volume or speaker output quality.

The [captured playback view](../prototype/evidence/early-playback-follow.png) shows C highlighted while the next F label is visible, with no purple selection. The preview remains paused with a small test phrase for the owner to try. A stale frame from the hidden browser was replaced after checking the visible rendered result; the saved image is the verified playback frame.

All 43 existing musical behavior tests passed after the code changes. Both script blocks compile, and source IDs/literal references remain consistent. No private scroll-helper or mock-DOM test was added; the two failures were reproduced and checked through actual browser controls, using the previously agreed third seam.

On continuation the local server was unavailable; it was restarted on the same loopback address. HTTP returned 200, and the served bytes match the artifact (SHA-256 `42aae22d895b1f5d49b99b8e1e3f0135eac4eee6d7b6ec48f250c0638a64c55a`). Perceived loudness, dense-passage distortion, latency, and Android behavior remain unmeasured. Keep the ticket claimed pending the owner's trial; scratch state remains in memory only.

### Tenth revision: mouse panning and centered note entry

October 29, 2026: the owner requested right-button dragging to pan the timeline and smooth scrolling to keep the editing cursor visible during note entry. This directly authorizes the revision; no further scope approval is needed.

- Right-button movement of at least four pixels pans horizontally from the original scroll position. It can start on a note, box, row, ruler, cursor, or blank timeline space. Part controls retain their own input behavior. The gesture does not edit notes, change selection, or move the editing cursor. Release after a drag never deletes the starting note; Escape restores the previous view. A right-click without dragging still deletes the clicked note, now on release, and Undo restores it.
- Suppress the timeline context menu because some browsers open it on press, before the gesture can be identified as a click or drag. Pointer capture lets the gesture finish outside its starting element. Playback following yields while the right button is held and resumes after release.
- Center the editing cursor after note entry, Next step, seeking, completed note edits, zoom changes, and returning from playback. Leave it at the left edge near the song start. Add only visual room after the final measure so the end cursor can sit in the middle without adding measures or changing playback length. Reduced-motion preferences use immediate scrolling.
- Manual scrolling and panning may leave the cursor offscreen while inspecting other music. The next editing or navigation action centers it again. This is the stated interpretation of “always in view,” so automatic following does not fight manual navigation. Keyboard focus restoration does not override the intended scroll position.

Scope reaches the existing pointer handlers, deletion gesture, cursor rendering, scroll positioning, zoom and playback controls, viewport resizing, and usage notes. Musical commands, note timing, saving, and audio remain unchanged. No dependency or private test interface was added.

#### Checks and remaining trial

The cursor failure was reproduced before editing at the agreed visible-control seam: seeking to quarter position 12 at Zoom 160 left the cursor at 1920 px with scroll zero in a 912 px viewport. Entering a Melody quarter note moved the cursor to 2080 px but placed it only 24 px from the right edge.

Afterward, real browser controls and assertions checked centering after Melody entry, the final measure boundary, song extension, explicit position changes, and Zoom. At quarter position 18 with Zoom 160, the cursor was at 2880 px and scroll at 2527 px in a 707 px viewport, within one pixel of the center. At the final captured view, position 18 was centered at Zoom 48. Smooth scrolling is asynchronous; assertions used the settled view rather than the first frame.

Right-click deleted only the clicked note, and Undo restored the written-note table. Left-dragging a quarter note from position 12 to 13 still snapped correctly and committed one undoable edit. The browser reported no warnings or errors. All 43 existing musical behavior tests pass; both inline scripts compile, IDs are unique, and literal element references resolve. The served HTML matches the source, SHA-256 `300039b5f48ea9a51852fe41a339c6919767b3843fb807c4502ef5d7c1f1bf16`.

The browser tool supports left dragging and right clicking, but not a drag with the right button held. Right-button panning, Escape during that pan, and playback-follow interaction during a pan remain owner checks, not verified results. Try dragging from both a note and empty space, then confirm that notes remain unchanged; try a stationary right-click and Undo separately. Reduced-motion and device resizing were not directly exercised in this revision.

The [centered-entry screenshot](../prototype/evidence/centered-note-entry.png) records the visible final melody fixture. Keep this ticket claimed until the owner's trial; the prototype still loses scratch notes on reload.
