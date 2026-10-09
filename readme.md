# Undercards Script #

Looking to install the script? [Click Here](https://git.io/fxysg)

## Plugin Registry ##

Community plugins are listed in [plugins.json](plugins.json), which UnderScript fetches from `master` to populate the "Community Plugins" menu. To add a plugin, open a pull request with an entry:

```json
{
  "name": "Deck Tracker",
  "author": "feildmaster",
  "updateURL": "https://github.com/UCProjects/plugin-tracker/releases/latest/download/tracker.meta.js"
}
```

- `name` **must** match the name the plugin passes to `underscript.plugin(name)`, otherwise UnderScript can't tell that it's already installed.
- `updateURL` points at anything the version can be read from: a userscript (or `.meta.js`) file, a gist, or a github release. The install link is taken from its `@downloadURL`, or from the release's `.user.js` asset.
- `downloadURL` is optional, and only needed when the install link can't be derived from `updateURL`.

To try entries out before pushing them, declare the file as a `plugins.json` resource in your development userscript header:

```js
// @grant    GM_getResourceText
// @resource plugins.json file:///path/to/UnderScript/plugins.json
```
