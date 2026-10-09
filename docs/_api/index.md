---
title: Plugin API
---
UnderScript exposes its API to other scripts through the `underscript` variable. Most plugins start by creating a plugin object:

{% highlight javascript %}
const plugin = underscript.plugin('My great plugin', '1.0.0');
plugin.logger.info('Hello from', plugin.name);
{% endhighlight %}

The [Plugin Object]({% link _api/plugin/index.md %}) is where most of the API lives. The [UnderScript Object]({% link _api/underscript/index.md %}) has a few extra helpers.

## Checking the version
Features are added over time. To only use a feature when it exists, check the version first:

{% highlight javascript %}
if (underscript.semver.isOlder('0.64.0')) {
  // Safe to use features from 0.64.0
}
{% endhighlight %}

See [underscript.semver]({% link _api/underscript/semver.md %}).

## Editor support
Starting with 0.65.0, every release has a file called `underscript.d.ts`. It is optional, and plugins work the same without it, but editors like VS Code use it to suggest and check your code. Download it from the [latest release](https://github.com/UCProjects/UnderScript/releases/latest) and put it next to your plugin's script.
