# Godot Android feasibility for the song composer

Research date: October 29, 2026. Target: the owner's Redmi Note 9 running Android 12, as reported by the owner. No physical-device measurements were made. This answers the [research ticket](../../.scratch/song-composer-mobile/issues/02-godot-android-feasibility.md); it does not select an engine.

**Finding:** Godot has documented Android export, touch, polyphony, persistent storage, and native file-picker APIs. The largest unresolved technical question is the implementation cost and measured quality of musical scheduling and touch-to-sound response. The existing browser prototype already has future audio scheduling and tested musical logic. Neither route has established acceptable performance on this phone.

## Version, export, and device compatibility

**Documented:** Godot 4.7.2 is the current stable release; 4.8 is in beta. Use matching editor and export templates when preparing a later experiment. The stable export guide recommends OpenJDK 17, accepts newer JDKs, and lists Android Platform-Tools 35+, Build-Tools 35.0.1, Platform 35, command-line tools, CMake 3.10.2.4988404, and NDK r28b. These are build-host requirements, not a requirement that the phone run Android 15. C# Android export is still marked experimental. [Release archive](https://godotengine.org/download/archive/), [Android export guide](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html).

For exported projects, Compatibility requires Android 7+ and OpenGL ES 3.0; Mobile/Forward+ require Android 9+ and Vulkan 1.0. These are basic-project baselines, not performance guarantees. Android 12 clears the OS baseline; this research did not inspect the phone's GPU driver, available RAM, ABI, or thermal behavior. **Inference:** start a small 2D experiment with Compatibility. The word “Mobile” does not itself make that renderer the best choice for this editor. [System requirements](https://docs.godotengine.org/en/stable/about/system_requirements.html#exported-godot-project).

**Local observations, read-only:**

| Component | Evidence |
| --- | --- |
| Godot | `/usr/bin/godot`; `godot --version` returned `4.7.2.stable.arch_linux.ed1daf0bf`. |
| Java | `/usr/bin/java` and `/usr/bin/javac`; runtime reports OpenJDK `21.0.12.1`. |
| Android tools | `adb`, `sdkmanager`, `apksigner`, `zipalign`, and `gradle` were absent from `PATH`. This does not prove they are absent everywhere. |
| SDK configuration | Godot's `export/android/android_sdk_path` points to `/home/apldsgn/Android/Sdk`, which does not exist. Its Java SDK path is empty. Common `/opt/android-sdk` and `/usr/lib/android-sdk` paths were also absent. |
| Export templates | `/home/apldsgn/.local/share/godot/export_templates` exists but is empty. |

Godot is installed; Android export readiness is not established. No SDK, template, plugin, or other dependency was installed, and no APK was built or sent to a device.

## Touch and layout

**Documented:** `InputEventScreenTouch` provides a finger index, press/release, position, and cancellation; `InputEventScreenDrag` provides indexed drag movement. Controls have anchors and offsets, and Godot provides resolution/stretch configuration. `DisplayServer.get_display_safe_area()` is implemented on Android and exposes the unobscured display area. These are sufficient building blocks for a landscape timeline and keyboard, but they do not decide which gesture means scroll, select, move, or resize. [Touch events](https://docs.godotengine.org/en/stable/classes/class_inputeventscreentouch.html), [drag events](https://docs.godotengine.org/en/stable/classes/class_inputeventscreendrag.html), [anchors](https://docs.godotengine.org/en/stable/tutorials/ui/size_and_anchors.html), [resolution handling](https://docs.godotengine.org/en/stable/tutorials/rendering/multiple_resolutions.html), [safe area](https://docs.godotengine.org/en/stable/classes/class_displayserver.html#class-displayserver-method-get-display-safe-area).

**Inference:** both engines need explicit gesture ownership and cancellation, usable hit areas, a touch replacement for modifier keys/right-click, and a layout that survives the software keyboard and rotation. Desktop mouse emulation cannot establish multi-touch usability. Godot's screen-reader feature list currently names desktop platforms, not Android; do not assume that custom controls will work with TalkBack without testing. [DisplayServer feature support](https://docs.godotengine.org/en/stable/classes/class_displayserver.html#enum-displayserver-feature).

## Audio: distinguish audition, scheduling, and output delay

**Documented:** `AudioStreamPlayer` plays non-positional audio and supports multiple voices. Its `max_polyphony` defaults to one; exceeding the limit cuts the oldest sound. `AudioStreamPlaybackPolyphonic.play_stream()` gives each voice an ID, volume, pitch scale, and bus, and reports failure when its polyphony capacity is full. This is a plausible small sample-audition path. Pitch scaling also changes playback speed, so one transposed recording is not automatically a complete piano instrument. [AudioStreamPlayer](https://docs.godotengine.org/en/stable/classes/class_audiostreamplayer.html), [polyphonic playback](https://docs.godotengine.org/en/stable/classes/class_audiostreamplaybackpolyphonic.html).

The ordinary `play_stream(stream, from_offset, …)` API starts immediately. `from_offset` is an offset **inside the sound**, not a future clock timestamp. It therefore does not directly replace Web Audio's `start(when)`, which schedules against `AudioContext.currentTime`. This does **not** mean sample-accurate native sequencing is impossible. It means that a suitable scheduler/mixer is separate implementation work. [Godot method contract](https://docs.godotengine.org/en/stable/classes/class_audiostreamplaybackpolyphonic.html#class-audiostreamplaybackpolyphonic-method-play-stream), [Web Audio scheduling](https://www.w3.org/TR/2021/REC-webaudio-20210617/#dom-audioscheduledsourcenode-start).

**Possible implementation paths, not selected designs:**

| Path | What it answers | Remaining cost or limit |
| --- | --- | --- |
| Play preloaded short samples through ordinary voices | Simple piano audition and polyphony | Calling note starts from visual-frame callbacks does not establish precise musical scheduling. |
| Render a short phrase into PCM, then play one `AudioStreamWAV` | Places note boundaries at known sample positions | Rebuilding after edits and keeping long audio in memory need evaluation; audition remains separate. |
| Fill an `AudioStreamGenerator` buffer from a sample-indexed note plan | Can implement a continuous scheduled mix with precise positions inside generated data | Requires a mixer, bounded buffer work, note envelopes, cancellation, and underrun handling. |

`AudioStreamWAV` accepts dynamically generated PCM. `AudioStreamGenerator` defaults to a 0.5-second buffer; a shorter buffer reduces queued delay but raises underrun risk. Godot recommends C# or compiled GDExtension for generator performance; lower sample rates are suggested for GDScript. `AudioStreamGeneratorPlayback.get_skips()` counts underruns. These facts identify experiments, not a requirement to add native code now. [WAV/PCM](https://docs.godotengine.org/en/stable/classes/class_audiostreamwav.html), [generator](https://docs.godotengine.org/en/stable/classes/class_audiostreamgenerator.html), [generator playback](https://docs.godotengine.org/en/stable/classes/class_audiostreamgeneratorplayback.html).

Godot mixes audio in blocks. Playback-position correction can include time since the last mix and estimated output latency. The synchronization tutorial is explicitly marked as not yet updated for 4.7, so treat its examples as guidance to verify. Crucially, `audio/driver/output_latency` is documented as **ignored on Android**. Its desktop default of 15 ms is not a promised phone latency. Godot's web “Sample” playback mode is also a separate web-specific optimization, not evidence that Android sample playback bypasses all mixing delay. [Audio synchronization](https://docs.godotengine.org/en/stable/tutorials/audio/sync_with_audio.html), [audio project settings](https://docs.godotengine.org/en/stable/classes/class_projectsettings.html#class-projectsettings-property-audio-driver-output-latency).

Android recommends a low-latency native audio path, suitable buffers, and callbacks without blocking work; results vary by device and route. This research did not audit Godot's Android driver implementation or establish which optimizations its exported build uses. Measure speaker and wired output separately; evaluate Bluetooth separately if required. Reported engine latency, tap-to-sound delay, scheduling jitter, and input/output round-trip latency are different measurements. [Android low-latency guidance](https://developer.android.com/games/sdk/oboe/low-latency-audio), [latency definitions and measurement](https://developer.android.com/ndk/guides/audio/audio-latency).

## Lifecycle and local file exchange

**Documented:** a mobile Godot app can be killed while suspended. `NOTIFICATION_APPLICATION_PAUSED` is the documented opportunity to handle suspension; Android Back exits by default unless configured otherwise. Android 12 also enforces audio-focus fade-out/muting under specified conditions, including competing playback and calls. **Inference:** a foreground-only first composer should save recoverable state promptly, cancel or pause audio on interruption, and resume only in a defined state. Do not rely on a final close event or assume audio focus is fully handled for this use case. [Godot quit handling](https://docs.godotengine.org/en/stable/tutorials/inputs/handling_quit_requests.html), [Android audio focus](https://developer.android.com/media/optimize/audio-focus).

Reliable background playback would be additional product and integration work. Android documents a media-session service and foreground-service setup for that purpose; this is not established by exporting an ordinary Godot scene. Chrome pages can also freeze or be discarded, and final unload events are unreliable on mobile. Neither candidate has demonstrated background behavior here. [Android background playback](https://developer.android.com/media/media3/session/background-playback), [Chrome page lifecycle](https://developer.chrome.com/docs/web-platform/page-lifecycle-api).

Godot's `user://` is writable persistent app storage, but on mobile other apps cannot directly access it. For user-controlled import/export, `FileDialog.use_native_dialog` with `ACCESS_FILESYSTEM` uses the Android picker. `DisplayServer.file_dialog_show()` explicitly documents Storage Access Framework URIs that can be passed directly to `FileAccess`. Android's framework grants access to the chosen document without broad storage permission. This supports a small local project-file round trip without assuming access to arbitrary filesystem paths. [Data paths](https://docs.godotengine.org/en/stable/tutorials/io/data_paths.html), [FileDialog](https://docs.godotengine.org/en/stable/classes/class_filedialog.html#class-filedialog-property-use-native-dialog), [Android URI support](https://docs.godotengine.org/en/stable/classes/class_displayserver.html#class-displayserver-method-file-dialog-show), [Storage Access Framework](https://developer.android.com/training/data-storage/shared/documents-files).

**Inference:** keep recovery saves separate from explicit exchange files. Validate a versioned project document before replacing the current song; preserve current work on cancel, invalid input, or write failure. Test picker providers and access after relaunch. Exporting a document does not itself transfer it to the computer. The browser can use standard user-selected file input, but its import/export and persistent storage are not implemented in the current prototype. [HTML file input](https://html.spec.whatwg.org/multipage/input.html#file-upload-state-(type=file)).

## Comparison and tests that can settle the question

**Local source evidence:** the [browser reference](../../.scratch/song-composer/prototype/README.md) reports 43 musical behavior tests. Its `sound()` schedules oscillator/envelope starts on the audio clock; `tick()` runs every 25 ms and queues a 120 ms horizon. These are inspected implementation values, not latency measurements. Source and test harness were read; tests were not rerun during this research.

| Decision factor | Extend the existing browser prototype | Small Godot experiment |
| --- | --- | --- |
| Musical rules | Reuses existing JavaScript command/inspection and playback-plan logic. | A native-language implementation needs behavior parity; existing JS tests do not automatically test it. |
| Touch trial | Already accepted as the first trial; touch layout/gestures still need implementation and phone evidence. | Can test native touch controls and rendering, but needs a separate scene and export setup. |
| Audio | Future audio scheduling already exists; actual Android latency and timer resilience remain untested. | Polyphony exists; audition is simple, while precise sequencing needs an explicit audio implementation. |
| Files and interruptions | Both are missing from the current in-memory prototype. | Native APIs exist, but recovery, validation, and interruption behavior still need implementation. |

**Proposed minimum experiments, after setup is authorized:**

1. **Export and touch:** one Compatibility APK with a short timeline, keyboard, move/resize handles, and cancellation. Record engine/build, phone/OS, orientation, display size, audio route, and browser version for comparison. Check landscape writing, portrait review, safe areas, scrolling conflicts, two fingers, and software-keyboard dismissal. Do not port harmonic analysis to answer these questions.
2. **Audio:** use the same short phrase, sustained chord, metronome, and audition sound in both candidates. Compare quiet playback with repeated scrolling. Begin with eight simultaneous voices, then test a representative dense composition. Record onset spacing, audible glitches, stuck voices, pause/loop behavior, and tap-to-sound delay. For Godot, compare ordinary sample audition with a short pre-rendered phrase; try a generator only if the intended editing/playback behavior requires it. Log generator skips if used. App timestamps alone are not an end-to-end latency measurement; use an external recording or suitable loopback setup and document the method.
3. **Recovery and exchange:** save one small project; switch apps, lock/unlock, use Back, interrupt audio, and terminate/relaunch. Export through the picker, copy the file to the computer, and re-import. Verify notes, parts, timing, context, and volumes. Cancel and reject malformed files without losing the current song.

Agree acceptable audition delay, musical timing error, and touch error rate before interpreting results; none has been accepted yet. Use the same conditions when comparing engines, including a sustained session to expose heat or throttling.

Keep tests at the accepted public seams: editor commands/inspection and playback plans. If ported, replay shared fixtures for triplets, held notes, loops, selection edits, and undo. Add a deterministic scheduler check for expected sample positions and stop/reset behavior, plus a project-file round trip and invalid-file rejection. Godot can run scripts from the command line and supports headless mode; headless checks cannot prove touch comfort, rendering, accessibility, or physical audio latency. [Godot command line](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html).

**Recommendation:** complete the accepted browser touch trial first, then use a small Godot audio/export probe to address its remaining technical uncertainty. Compare results and implementation cost before choosing the engine or writing an engine ADR.

**Limits:** no phone connection, APK export, audible comparison, performance measurement, browser automation, installation, or new implementation was attempted. Native driver behavior, TalkBack support on the target, file-provider persistence, and lifecycle recovery remain device-test questions. No new tool approval denial occurred in this research.
