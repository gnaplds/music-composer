# Palette research and taste decisions

Status: approved and implemented locally; rendered visual acceptance remains open. November 20, 2026.

## Intent

An app for learning and writing music, meant to feel precise, calm, and approachable. Musical content and the current action should lead. The owner is open to replacing the existing palette, subject to a taste interview and final shared understanding.

## Research

- [Ableton accessibility options](https://www.ableton.com/en/live-manual/12/accessibility-options-in-live/) documents themes and a high-contrast option. [Live 11 release overview](https://www.ableton.com/en/live-manual/11/) documents a reduced automatic track/clip palette. These support restrained functional color, not any claim that one hue improves composing.
- [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) sets 4.5:1 for ordinary text and 3:1 for large text. Use these alongside the color-analysis skill's APCA reading checks; APCA is an additional design check, not a substitute WCAG conformance claim.
- [W3C design guidance](https://www.w3.org/WAI/tips/designing/) supports adequate contrast and additional cues for information conveyed through color.

Recommendation is a design judgment: a warm ivory workspace with forest-green actions could give the practice-desk direction more character. It is not an experimentally proven best palette or a claim of exclusive originality. Alternatives are stone/aubergine and the familiar slate blue. Colors below are authored proposals, not sampled from competitors.

## Current source findings

Main text #243747 on #EDF2F6 measures 10.88:1 WCAG and APCA Lc 89.7: keep its clear lightness contrast. The current palette is not inherently unreadable.

The more useful issue is overloaded meaning: violet serves diminished membership, selected boxes, and Roman numerals; teal serves sixth membership and playing boxes. Changing only the brand hue would leave this ambiguity. Musical categories are not Melody/Chord/Bass colors. Preserve existing category symbols and labels.

Source contains many hardcoded colors outside shared tokens. Implementation must reach those rules, both themes, focus/hover/selection/playback/error states, piano symbols, and any color-naming help copy. Saved composition data and musical classification should not change. Update the worker shell version and regenerate the existing distribution after implementation.

## Candidate light palettes

| Role | A: Ivory/forest | B: Stone/aubergine | C: Slate blue |
| --- | --- | --- | --- |
| Page | #F3F1EA | #F2EFF3 | #EDF2F6 |
| Surface | #FCFBF7 | #FCFAFD | #F8FBFD |
| Ink | #302D26 | #302A33 | #243747 |
| Secondary text | #605B51 | #625766 | #566B7A |
| Primary action | #315B49 | #68476D | #294C66 |

A has warm neutral undertones and a muted green accent; B has consistent mauve undertones; C retains cool blue undertones. Keep surfaces low in chroma (how pure the color is): A page OKLCH (0.958, 0.010, 93.6), B (0.956, 0.006, 317.8), C (0.959, 0.008, 241.7).

Primary values: A OKLCH (0.435, 0.056, 164.5); B (0.449, 0.073, 322.1); C (0.402, 0.060, 242.4). All keep substantial lightness (value) differences from pale surfaces.

Confirmed with the skill's contrast command:

| Pair | WCAG | APCA magnitude |
| --- | --- | --- |
| A ink/page | 12.15:1 | 91.9 |
| White/A primary | 7.71:1 | 91.4 |
| B ink/page | 12.24:1 | 91.6 |
| White/B primary | 7.75:1 | 91.6 |
| C ink/page | 10.88:1 | 89.7 |

These are initial role palettes, not complete approved light/dark/state specifications. Dark mode and musical category colors follow the owner's taste answers.

## Interview tree

1. Overall hue/temperature preference; typical light/dark use; willingness to clarify functional color roles.
2. Chosen direction → complete light/dark/state palette and specific musical-category mapping.
3. Final shared understanding → implementation → regression and visual checks.

Round 1 confirmed: A (ivory and forest), light and dark equally, and clarification of color roles. No glossary term or costly architectural choice has been settled; no glossary change or ADR is needed.

## Final proposal for agreement

Use A's light palette above. Dark mode follows the same warm neutral and forest hue families rather than retaining blue-black surfaces:

| Role | Dark hex | OKLCH |
| --- | --- | --- |
| Page | #1B1A17 | 0.218 0.006 91.6 |
| Surface | #282722 | 0.272 0.009 97.7 |
| Ink | #EEECE5 | 0.943 0.010 93.6 |
| Secondary text | #C6C2B8 | 0.814 0.015 88.7 |
| Primary action | #3F6654 | 0.475 0.053 163.6 |
| Entry cursor | #E7AD56 | 0.785 0.124 75.2 |
| Error text | #F3B7AB | 0.831 0.072 31.5 |

White labels on the dark primary measure 6.48:1 WCAG and APCA magnitude 87.2. The page is a warm charcoal; raised surfaces are lighter. Keep white button labels distinct from the slightly softened body ink.

Functional mapping:

- Forest: main actions and consistent selection outlines. Dark selection uses a lighter forest stroke, provisionally #8AB29D, to stay visible; check all adjacent note surfaces during implementation.
- Neutral ink: chord names and Roman numerals, distinguished by size/weight; moving playback line and the playing box's top marker. Preserve both markers when selection and playback overlap.
- Amber: entry cursor and entry location only; light #9A5B0A, dark #E7AD56. Other warnings use text and appropriate error/status cues rather than an amber decorative fill.
- Sixth membership: blue, replacing teal so it does not compete with forest actions. Light foreground/background #1C5373 / #DCEBF4; dark #C1DEF2 / #243D4D.
- Diminished membership: plum. Light #623B6E / #EFE2F2; dark #EACFF3 / #44304C.
- Outside membership: warm gray. Light #4C483E / #E8E4DB; dark #DBD7CD / #38352F.
- Retain category symbols and labels, standard piano key contrast, and clear error text. Musical colors encode content categories, so their extra hues are deliberate exceptions to the one-primary UI rule. They do not tint the surrounding workspace. Outside membership remains neutral deliberately rather than becoming a third vivid category.

The skill's palette script flags the category hues and mixed category-fill temperatures when treated as generic UI surfaces. Those are musical content encodings, not work-surface neutrals. Blue and plum have close foreground lightness (0.422 and 0.420); keep similar visual weight and verify distinction with symbols, not hue alone. Candidate label colors were darkened/lightened after contrast checks; complete checks at rendered sizes remain necessary, particularly existing small note labels.

Implementation reaches the full CSS cascade, both themes, hover/focus/disabled/selected/playing states, piano symbols, help copy, and service-worker shell version. Preserve layout, large chord labels, piano resizing, saved music, and timing. Use existing theme controls; no new theme picker or dependency. Existing tests and targeted color-role checks follow implementation, with rendered checks where permitted.

Q4 confirmed: the owner approved this mapping and authorized implementation.

## Evidence limits

Palette boards and a compact swatch diagram were generated in /tmp/composer-palette-research. Board shares are illustrative inputs, not measured app coverage; no area finding is inferred from them. Greyscale and simulated deuteranopia boards were inspected for the two proposed directions. Whole-app color-blind safety remains unverified.

Prior browser policy blocked the local file preview. No browser workaround was attempted. The swatch diagram is not a rendered app preview. Desktop/mobile rendering, actual area distribution, complete state contrast, and device appearance remain pending.


## Implementation evidence

- Replaced hardcoded workspace colors with shared role tokens and removed the duplicate dark component-color rules. Both themes use the approved hue families. Musical categories, key symbols, hover, focus, errors, selection, entry, and playback use explicit roles.
- Contrast corrections retain the chosen hue direction: light sixth foreground is #164C6A (including white-key symbols), light diminished foreground is #5E3869, and dark amber is #ECB45F. These small changes improve label contrast on the actual intended surfaces. Other values follow the proposal above.
- Selection outlines and playback inset strokes no longer replace one another. Ordinary button hover excludes notes so it cannot erase their category fills. Piano sounding states use neutral contrast, leaving amber reserved for entry.
- All 61 tests pass. The new regression test reads theme values from the app and verifies WCAG text pairs at 4.5:1 and meaningful boundaries at 3:1, including musical selection and keyboard symbols.
- Additional skill-script measurements cover 31 role pairs per theme. All meet the chosen APCA floors: 75 for main text and musical labels, 60 for secondary/control text, and 30 for informative boundaries. These measurements check intended pairs, not rendered cascade, alpha compositing, or full WCAG conformance. Minimum checked text WCAG ratio is 4.55:1 light and 5.38:1 dark; minimum checked boundary ratio is 3.18:1 light and 3.71:1 dark.
- Three inline scripts compile; 130 HTML IDs are unique; source block delimiters balance. No new dependency or musical/data-model change was introduced. The worker cache is v4, and the existing distribution build is regenerated.
- Local implementation only. No deployment or rendered desktop/mobile verification is claimed. The earlier browser restriction remains the limit on visual acceptance.
