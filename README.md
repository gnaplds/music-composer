# Music Composer

A playable desktop and phone browser prototype for writing songs with chord boxes and independent Melody, Chord, and Bass parts. Enter notes on the piano, arrange them on the timeline, inspect chord names and Roman numerals, and hear the result.

**Prototype status:** compositions stay in memory. Reloading or closing the page loses the notes. Saving, MIDI export, and final piano sound are planned but not implemented. The phone layout supports landscape writing and portrait review; physical-device acceptance is pending.

Open [Simple Composer](https://simplecomposer.netlify.app/) on a computer or phone. On a phone, turn it sideways to write. Select notes, then choose Move or Resize before dragging; ordinary swipes scroll. Tools contains the secondary controls. The [phone guide](.scratch/song-composer/prototype/README.md#phone-workflow) covers the trial.

## Run locally

From this repository's root, with Python 3 installed:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory .scratch/song-composer/prototype
```

Open <http://127.0.0.1:8765/>. The app is a single HTML file with no runtime dependencies or external assets. You can also open [index.html](.scratch/song-composer/prototype/index.html) directly in a browser.

The [prototype guide](.scratch/song-composer/prototype/README.md) explains note entry, snapping, multi-note editing, playback, and the remaining usability checks.

## Tests

With a current Node.js LTS release installed:

```sh
node .scratch/song-composer/prototype/composer.test.cjs
```

The 45 tests cover musical editing and playback planning. Browser interaction evidence and its limits are recorded in the [desktop ticket](.scratch/song-composer/issues/06-desktop-workspace.md) and [phone trial ticket](.scratch/song-composer-mobile/issues/03-phone-touch-prototype.md).

## Deploy on Netlify

Import `gnaplds/music-composer` from GitHub into Netlify and select the `master` branch. Keep the base directory at the repository root. The tracked [netlify.toml](netlify.toml) supplies the build command and publish directory:

- Build command: `mkdir -p dist && cp .scratch/song-composer/prototype/index.html dist/index.html`
- Publish directory: `dist`
- No environment variables or framework preset are needed.

Only the self-contained app page is copied to the hosted site. Planning files, tests, and screenshots remain in GitHub. Once Netlify is connected, pushes to the production branch trigger new deployments. See [Netlify's repository deployment guide](https://docs.netlify.com/start/quickstarts/deploy-from-repository/).

Hosting the prototype does not add project storage or synchronization. Each visitor's scratch composition remains in that browser tab.

## Project notes

- [Session handoff and next steps](handoff.md)
- [Musical vocabulary](GLOSSARY.md)
- [Desktop plan](.scratch/song-composer/map.md) and [initial scope](docs/planning-intake.md)
- [Android plan](.scratch/song-composer-mobile/map.md) and [Godot feasibility study](docs/research/godot-android-feasibility.md)
- [Architecture decisions](docs/adr)

The source remains under `.scratch/` because it is an interaction prototype. Some historical planning links refer to a separate local `barry-harris/` study; that material is excluded from this repository and is not needed to run the app.
