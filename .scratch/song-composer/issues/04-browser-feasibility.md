# Verify desktop audio and offline feasibility

Parent: [Plan a playable desktop song composer](../map.md)
Labels: wayfinder:research
Type: research
Status: resolved
Assignee: browser-feasibility-research
Blocked by: none

## Question

What documented browser capabilities and limits should guide a desktop website with a playable piano keyboard, timed polyphonic playback, looping, and offline save/reopen?

Investigate audio activation, scheduling and background behavior; piano samples versus synthesized sound and their licensing/cache implications; offline app and asset availability; browser-local project durability, quota and eviction; and file backup/restore. Distinguish first online load from later offline use and separate external MIDI device access from the on-screen keyboard. Cite current primary sources. Report technical facts and recommendations without selecting the product scope or claiming that audio has been heard or tested.

## Answer

Resolved October 27, 2026. See [Desktop browser audio and offline feasibility](../../../docs/research/browser-audio-offline.md) for the evidence and primary-source citations.

The required browser capabilities exist. Audio must be activated through user interaction, and note events should be scheduled on the Web Audio clock. Offline reopening requires prior installation and successful caching of the app and piano assets. Browser-local storage is subject to failure and deletion, so portable backup/restore is recommended for the project-recovery decision. The on-screen piano does not require external MIDI access.

The research does not select a sound library or guarantee sample licensing, audible quality, browser latency, background playback, or host-specific offline behavior. Those require the implementation choice and runtime checks. The repository has no commits or remote, so findings are captured locally rather than on a pushed research branch. No app was implemented or deployed during this investigation.
