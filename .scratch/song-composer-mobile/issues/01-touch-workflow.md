# Define the phone writing workflow

Parent: [Plan an Android song-composition workspace](../map.md)
Labels: wayfinder:grilling
Type: grilling
Status: open
Assignee: unassigned
Blocked by: none

## Question

How should the owner enter, select, inspect, move, resize, and delete notes on the phone without touch gestures causing accidental musical edits?

Starting conditions are accepted: landscape writing on a Redmi Note 9 with Android 12, a browser prototype first, and the existing musical rules. Decide what stays visible with the timeline and piano, where secondary controls open, and how the three parts remain clear within the available height. Define alternatives for desktop right-click and modifier-key selection; distinguish navigation from note/cursor dragging. Establish a small real musical task, the prototype feature boundary, and visible-control/device checks that can settle whether the interaction works.

## Context for the interview

Source inspection of the [desktop prototype](../../song-composer/prototype/index.html) on October 29, 2026 found:

- Notes start move/resize gestures on pointer-down. Their resize handle is at most 10 CSS pixels wide, and notes disable native touch panning. The cursor handle is 18 pixels wide.
- Note-group selection relies on Ctrl/Cmd or Shift, deletion relies on context-menu events, and drag cancellation exposes Escape. The mobile workflow needs accessible touch equivalents without changing the underlying editing rules.
- The piano renders 37 pitches in a region with a 680-pixel minimum width. The desktop workspace reserves a separate inspector column; its narrow-width rule stacks the inspector and makes the keyboard dock non-sticky. These rules do not establish a usable landscape phone workspace.

These are source observations, not measured phone behavior. Candidate interaction patterns still need the owner's decision and a device trial; no touch gesture has been accepted implicitly.
