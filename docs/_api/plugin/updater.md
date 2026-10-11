---
title: plugin.updater()
categories: plugin
plugin: true
method: true
---
Let UnderScript check your plugin for updates. When a newer version is found, the user is told and can install it from the Pending Updates window.

This only exists when the plugin was created with a version, `underscript.plugin(name, version)`. It can only be called once.

## Syntax
> plugin.updater(*data*);

data
: Where to find updates. One of:
* A `string`. A link to the download. GitHub and gist links are supported.
* `{ downloadURL }`. The same, as an object.
* `{ updateURL }`. A link to something the version can be read from: a userscript, a `.meta.js` file, a gist, or a GitHub release (`USER/REPO`). The download link is read from its `@downloadURL`, or from the release's `.user.js` file.
* Both. `downloadURL` is only needed when it cannot be found from `updateURL`.

Return Value
: A function that stops checking for updates

## Properties
plugin.canUpdate
: `true` when the updater is registered and the user has not turned updates off for UnderScript or for your plugin

## Examples
{% highlight javascript %}
const plugin = underscript.plugin('My great plugin', '1.2.0');

// GitHub release
plugin.updater({ updateURL: 'USER/REPO' });

// Or a link to the script
plugin.updater('https://example.com/my-plugin.user.js');
{% endhighlight %}
