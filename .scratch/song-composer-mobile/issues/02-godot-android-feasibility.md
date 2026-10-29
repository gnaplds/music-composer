# Assess Godot for the Android composer

Parent: [Plan an Android song-composition workspace](../map.md)
Labels: wayfinder:research
Type: research
Status: resolved
Assignee: codex-godot-research
Blocked by: none

## Question

What capabilities, limits, and device experiments determine whether Godot is a suitable engine for this Android music editor compared with extending the browser implementation?

Use current primary sources to examine touch UI and responsive layout, desktop-to-Android export, supported Android/rendering constraints relevant to a Redmi Note 9 with Android 12, low-latency audition versus scheduled polyphonic playback, audio timing and buffering, background/lifecycle behavior, local project files and transfer, and meaningful testing seams. Inspect available local tools without installing or modifying them. Separate documented support from measured performance, identify what must be tried on the physical device, and avoid choosing the engine on the owner's behalf.

Keep findings in one linked Markdown research artifact. Do not install Godot, SDKs, plugins, or build tools; do not create or publish repository history.

## Answer and evidence

Resolved as a documentation and local-readiness investigation on October 29, 2026. See [Godot Android feasibility](../../../docs/research/godot-android-feasibility.md) for cited primary sources, local observations, the browser comparison, testing seams, and the smallest proposed device experiments.

Godot 4.7.2 is installed locally. Android export is not ready: the configured SDK directory is missing, relevant Android tools were not found in PATH, and the export-template directory is empty. Documented Android OS support includes Android 12, subject to renderer/GPU requirements and actual testing.

Touch, polyphony, persistent app files, and native Android document selection have documented APIs. The important audio distinction is that ordinary polyphonic `play_stream()` starts immediately and has no future start timestamp. Sample-indexed procedural or pre-rendered scheduling remains possible implementation work; it has not been built or measured here. Godot's output-latency project setting is ignored on Android.

The research question is answered; engine selection and device acceptance remain open. No Redmi Note 9 performance, touch usability, latency, background behavior, or file-recovery claim is established. No tools were installed, no APK was exported, and no prototype, intake, map, branch, or commit was changed. No new approval denial occurred.
