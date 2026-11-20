# UI character and motion

Status: implemented locally; rendered motion and device acceptance remain open. Updated November 20, 2026.

The owner requested a distinctive visual direction and useful UX animation after the initial polish. This document records proposals and answers before implementation.

## Constraints already agreed

- Keep Simple Composer and its current composing, harmony, saving, and file-exchange features.
- Keep readable, large chord boxes, an adjustable piano, and portrait mobile support.
- Keep simple English, visible labels, recoverable editing, and accessible controls.
- The initial slate-blue palette below was superseded by the approved ivory/forest palette on November 20, 2026. See [palette research and decisions](palette-research.md). Motion, layout, and large-label constraints remain unchanged.
- Preserve timing and direct note entry. Visual transitions must not delay sound or edits.

## Preliminary audit

This is a source review, not a rendered visual judgment. The local file preview was blocked by browser policy; no workaround or substitute rendering is claimed.

- The stylesheet contains several generations of spacing, border, typography, and theme rules. Consolidation is a candidate for visual consistency, subject to rendered checks.
- Inspector sections, disclosures, and tool sections use repeated dividers. Remove only those that spacing can replace; musical timing boundaries carry information.
- Musical violet and teal are functional categories, not evidence of decorative color misuse.
- Controls have a short hover shadow transition. Help and dialogs use native open/close behavior without a designed motion system.
- Cursor centering and playback following use smooth scrolling, except under reduced motion. Repeated editing and shortcut paths need review for unnecessary camera movement.
- Rendered density, visual hierarchy, clipping, and movement quality remain unverified.

## Confirmed direction

- Product: Simple Composer helps people write, hear, and inspect music through independent notes and chord boxes.
- Character: precise, calm, approachable.
- World: a piano practice desk and a working musical chart; neutral work surfaces, without simulated paper or hardware decoration.
- Moment: playback makes the relationship between sounding notes, the current harmony, and piano keys easy to follow.
- Signature: chord names and Roman numerals form one clear reading unit above sustained notes that continue across box boundaries.

Concept: the workspace reads like the music being written, with controls close to the musical action they affect.

In an empty composition, the piano and first-note hint establish the task. During editing, the same arrangement holds notes and harmony. Playback adds synchronized feedback. Pausing retains the readable composition. This rules out decorative entrance sequences and bouncing note blocks.

## Decision tree

1. Character and visual world → type, surfaces, spacing, control shape, signature treatment.
2. Motion intensity → motion per interaction, duration, interruption, reduced-motion behavior.
3. Taste references and dislikes → refine the direction against concrete examples.
4. Agreed direction and interaction plan → owner confirms shared understanding → implementation and visual verification.

## Interaction facts checked during round 1

| Interaction | Current behavior | Planning implication |
| --- | --- | --- |
| Piano entry and shortcuts | Immediate edits; cursor navigation can trigger smooth centering | Keep editing instant; examine scroll behavior for repeated actions |
| Note and piano resize | Direct pointer previews with cancellation | Keep direct manipulation without easing under the pointer |
| Playback | Audio scheduled ahead; visual updates every 25 ms, with occasional automatic scrolling | Measure visual smoothness before changing it; keep audio scheduling independent |
| Tools, Compositions, Help | Native dialogs/popover without entrance or exit transitions | Consider short transitions while preserving focus, Escape, and background interaction restrictions |
| Save feedback | Saving appears immediately; writes debounce by 250 ms | Consider stable status presentation without delaying writes or hiding errors |
| Reduced motion | Button transitions disabled; smooth timeline scrolling becomes instant | Extend the preference to every new transition |

The app has no animation library, decorative loops, or startup entrance sequence. Timeline rendering replaces its child nodes, which matters if a later design needs persistent animated elements. Smoothness and frame timing have not been measured.

## Round 1

- Q1 confirmed: precise practice desk, retaining the recently approved palette.
- Q2 confirmed: restrained motion; instant musical editing, brief transitions for panels and dialogs.
- Q3 confirmed: no outside references; judge the proposed direction against composing tasks.

## Approved implementation plan

### Visual treatment

- Keep the existing feature and section order, portrait workflow, large chord labels, and adjustable piano.
- Consolidate the stylesheet around the existing cool-neutral/slate palette and a 4 px spacing grid. Keep teal/violet musical meaning and the amber entry cursor.
- Use the system sans-serif family with clear type roles; use tabular figures for changing time and volume values. Musical notation keeps the sizing it needs for legibility.
- Give chord names and Roman numerals a consistent shared alignment and hierarchy. Preserve continuous held-note shapes across chord-box boundaries; the musical relationships are the distinctive content.
- Remove redundant panel edges and repeated captions after checking their function. Retain boundaries that communicate timing and selection.
- Keep 6 px control corners and one consistent monochrome style for interface icons. Preserve standard musical notation and piano-key colors.

### Interaction treatment

| Interaction | Proposed behavior |
| --- | --- |
| Note entry, selection, Undo, Play/Pause, keyboard navigation | Immediate feedback; no decorative movement or delayed sound |
| Note/cursor/piano dragging | Direct pointer response; no easing under the pointer |
| Cursor centering | Preserve the agreed centered editing position; repeated entry and shortcut actions use immediate centering instead of restarting smooth travel |
| Tools and Compositions | Quiet opacity/scale transition, initially 220 ms open and 160 ms close; keep native focus, Escape, and modal behavior |
| Help | Brief transition from the help-button side, initially 160 ms open and 120 ms close |
| Harmony/context disclosures | Short local expansion if it can preserve native semantics and interruption; keep keyboard activation immediate |
| Hover/press | Brief surface feedback on appropriate pointers; dense musical controls keep stable geometry |
| Saving | Reserve status space. Show pending edits honestly; delay the busy presentation until a save is slow, without delaying the write. Errors appear immediately and remain actionable |
| Playback | Preserve synchronized sounding-note, chord, and piano feedback. No decorative pulses or extra playback effects |
| Reduced motion and theme changes | Immediate equivalent states, including no fades under reduced motion; theme changes have no color transition |

Use existing CSS and browser APIs, with named duration and curve tokens. Opening and closing must be interruptible. An unsupported animation must fall back to usable instant behavior. The visual plan adds no audio effects or animation dependency.

### Verification and completion

- Check empty, composing, playing, selected, saving, error, offline, and dialog states on desktop and 390/375 px portrait layouts in both themes.
- Check keyboard paths, mid-transition reversal, reduced motion, quick repeated input, and the tenth repeated use of each transition.
- Inspect frames before claiming motion quality. Browser policy currently blocks the local file preview; report this separately from code/test completion if it remains unresolved.
- Run focused regression checks for changed state behavior and the existing composition tests. Update user-facing instructions only where the workflow changes.

Q4 confirmed: the owner approved this plan and authorized implementation on November 20, 2026.

No new domain term or hard-to-reverse architectural decision has been settled, so no glossary change or ADR is needed.

## Implementation evidence — November 20, 2026

- Kept the agreed cool-neutral palette, large chord labels, and adjustable piano. Removed repeated panel borders, aligned the harmony name and Roman numeral as a shared vertical unit, and reduced variation in panel spacing and heading weight. Timing boundaries and musical category colors remain meaningful.
- Tools and Compositions use native top-layer CSS transitions (220 ms open, 160 ms close); Help uses 160/120 ms from its top-right trigger side. Native focus, Escape, and popover behavior remain in place. Unsupported transitions fall back to instant opening. See [MDN dialog transitions](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) and [starting styles](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style).
- Keyboard-triggered panels and reduced-motion states are immediate. Musical entry, drag previews, and repeated editing centering are immediate. Playback following retains its existing behavior and reduced-motion preference.
- Play/Pause uses consistent monochrome CSS shapes. The playing-box indicator no longer adds a border that shifts its text.
- Save feedback shows Edits pending immediately, shows Saving only after 300 ms, and holds a displayed busy status for at least 500 ms. This changes presentation only. Failures and conflicts interrupt that display immediately; saved state is never claimed before a successful write.
- Native disclosures remain immediate. Their optional animation was deferred because it cannot be visually verified here; retaining native focus and hidden-content semantics takes priority over adding a custom expander.
- All 60 automated checks pass, including delayed save feedback, immediate errors, stale timer cancellation, and immediate cursor centering. These checks do not verify rendered CSS transition reversal, frame pacing, or physical phone behavior.
- The local file preview remains blocked by browser policy. No alternative browser or rendering workaround was used. Desktop/mobile screenshots, frame-by-frame motion, tenth-use evaluation, focus during visual exits, and device acceptance remain open. No craft score is claimed.

No animation library, new audio effect, startup sequence, or decorative playback motion was added. The service-worker shell version was advanced so the changed page can update through the existing safe update flow.
