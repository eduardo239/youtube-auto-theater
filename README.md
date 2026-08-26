# YouTube Auto Theater

Browser extension that automatically enables **theater mode** on YouTube watch pages and **collapses live chat** during livestreams.

Works in Chrome and Firefox (Manifest V3).

## What it does

- Turns on theater mode when you open a video
- Hides live chat on livestreams so the player uses more of the screen
- Runs again when you navigate between videos inside YouTube (SPA)

It only acts on `https://www.youtube.com/watch` pages. Other YouTube pages are ignored.

## Install from source

### Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select this folder

### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select `manifest.json` in this folder

Temporary add-ons in Firefox are removed when the browser restarts. For a persistent install, use the signed package from [Firefox Add-ons](https://addons.mozilla.org/).

## Privacy

The extension does not collect, store, or transmit any user data. It runs a local content script on YouTube and clicks the player’s own theater and chat controls.

See [PrivacyPolicy.md](PrivacyPolicy.md).

## License

MIT
