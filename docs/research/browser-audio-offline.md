# Desktop browser audio and offline feasibility

Research date: 27 October 2026. This report informs [Verify desktop audio and offline feasibility](../../.scratch/song-composer/issues/04-browser-feasibility.md). It records documented capabilities and recommendations; it does not select product scope or report a tested implementation.

**Assessment:** the browser provides the basic capabilities for a playable desktop composition editor. Reliable timing, offline readiness, and safe saving require explicit design. A website being open, playing once, or saving once does not establish those guarantees.

## Audio activation, timing, and background tabs

**Documented facts.** Chrome can suspend an `AudioContext` under its autoplay policy. Its documented recovery is to call `resume()` after user interaction. An explicit Play button or piano-key interaction is therefore a suitable activation point; the app should check whether the context actually reaches the running state. [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay/)

Web Audio supports multiple sound sources in one graph and schedules their start/stop times against `AudioContext.currentTime`. This supports simultaneous bass, chord, and melody notes with different durations. The API supplies oscillators and audio-buffer playback, rather than a standardized acoustic-piano instrument. [W3C Web Audio Recommendation](https://www.w3.org/TR/webaudio-1.0/)

JavaScript callbacks can be delayed by other main-thread work. Google's audio scheduling guidance uses a short look-ahead scheduler: a timer periodically queues upcoming events on the audio clock. Once queued, audio events do not depend on a timely UI callback. Scheduling too far ahead makes changes and transport control harder. [Google's audio scheduling guidance](https://web.dev/articles/audio-scheduling)

Chrome throttles some timers in hidden tabs. Recent audible playback provides an exemption under the documented policy, but silence does not. Chrome also documents page freezing/discarding under resource constraints; playing audio reduces that risk without removing it under extreme constraints. These are browser policies, not a guarantee of uninterrupted playback everywhere. [Chrome timer policy](https://developer.chrome.com/blog/timer-throttling-in-chrome-88), [Page Lifecycle API](https://developer.chrome.com/docs/web-platform/page-lifecycle-api)

**Recommendations.** Use the audio clock for note events and loop boundaries; use animation only to display progress. Track active voices so Stop also stops ringing notes. Handle suspension and resumption explicitly. Treat background-tab playback as a behavior to test, especially passages containing long rests. Do not promise uninterrupted playback during device sleep.

## Piano sound and offline assets

**Documented facts.** An `AudioBuffer` holds decoded audio in memory, and `AudioBufferSourceNode` plays that data. Oscillators generate waveforms. These primitives allow sampled or synthesized instruments, but the application must supply the instrument behavior and any recordings. [W3C Web Audio Recommendation](https://www.w3.org/TR/webaudio-1.0/)

**Recommendations.** Keep the agreed piano sound as a requirement to validate by listening. A simple synthesized tone may help test rhythm, but its existence would not prove that the piano requirement is met. For samples, assess download size, decoded memory, pitch coverage, sustained notes, note releases, and simultaneous voices. Cache the required recordings before declaring offline playback ready; an uncached remote sound URL remains a network dependency.

No sound library is recommended here. Before choosing one, check its own license for the exact recordings and any player code, including redistribution and attribution terms. A player package's license alone is not evidence that its sample files may be bundled. The report does not establish sample licensing or sound quality.

## Offline opening and saving

**Documented facts.** A service worker can intercept requests and serve cached assets. It is absent on a user's first visit and must install and activate before controlling pages. Therefore, a first visit cannot obtain an uncached application from an unavailable server. Service workers normally require HTTPS; localhost is supported for development. [Service worker lifecycle and scope](https://web.dev/learn/pwa/service-workers), [Chrome development guidance](https://developer.chrome.com/docs/workbox/improving-development-experience)

Google recommends Cache Storage for URL-addressed resources such as scripts and audio, and IndexedDB for structured application data. Both can support offline operation; merely storing a project does not cache the application that opens it. [Offline data](https://web.dev/learn/pwa/offline-data)

**Recommendations.** Define offline readiness as successful caching of the app and required piano assets, plus a verified project save. Check readiness before telling the user they can disconnect. Test closing the browser and reopening the app offline, not only disconnecting while an already-loaded page remains open. Updates should preserve projects and keep a usable set of application assets.

The chosen host's authentication, routing, and service-worker behavior have not been validated. An online login dependency could affect offline reopening; this is a question to test on the actual host, not an established blocker.

## Project durability and user-controlled backup

**Documented facts.** Browser storage starts in best-effort mode. The Storage Standard provides `persist()` and `persisted()`; granting persistence protects storage against browser eviction, while the user can still clear it. `estimate()` provides usage/quota estimates rather than a guaranteed allocation. [WHATWG Storage Standard](https://storage.spec.whatwg.org/)

WebKit documents eviction under storage pressure, aggregate quota pressure, or inactivity. A write can fail with `QuotaExceededError`; a published upper limit does not guarantee that amount of usable space. [WebKit storage policy](https://www.webkit.org/blog/14403/updates-to-storage-policy/)

A user-selected file can be read through a file input and the File API. A generated Blob can be offered as a download. Directly rewriting an existing file through File System Access requires permission and feature detection; the simpler download approach does not automatically overwrite the original. [W3C File API](https://www.w3.org/TR/FileAPI/), [Chrome file handling guide](https://developer.chrome.com/docs/capabilities/browser-fs-access)

**Recommendations.** Save projects in IndexedDB, show failed writes clearly, and request persistence where supported. Add a user-controlled project-file backup and restore path, with a versioned format and validation before changing saved data. This is a durability recommendation, not an accepted feature decision. Browser-local storage should not be described as a separate backup. Validate that restoration preserves musical data, including key/meter changes and independent note timing.

## Keyboard access and remaining checks

Web MIDI provides access to MIDI devices and their messages. It is separate from Web Audio. **Inference:** an on-screen piano operated with pointer or computer-keyboard events can trigger Web Audio directly; it need not request MIDI-device access. A MIDI-number pitch representation does not change that. [W3C Web MIDI API](https://www.w3.org/TR/webmidi/)

No audio was heard or measured. Still untested: input latency, audible piano quality, dense chords, long loops, stop/restart, hidden tabs, offline reload, denied persistence, failed writes, and backup restoration. These checks should use the selected desktop browser and actual host.

This repository has no commits or remote, so the Wayfinder research branch and push could not be performed. The evidence remains in this local report; no application code, hosting registration, or product decision was created.
