---
title: Plugin settings tabs
date: 2026-09-26
version: 0.64.0
---

Every plugin gets its own page in UnderScript's settings window, under Plugins. A plugin with a lot of settings can split them into tabs, which show across the top of its page. The first tab is named after the plugin by default.

When there are more tabs than fit on one row, the tabs are split into pages. Arrows next to the tabs flip between the pages, and hovering an arrow shows which page you would go to, like "Next (2 of 3)". Special thanks to Wiza for the original idea.

## For plugin authors ##
Add a tab with [settings.page()]({{ site.baseurl }}{% link _api/plugin/settings.md %}), and rename the first one with [settings.name()]({{ site.baseurl }}{% link _api/plugin/settings.md %}).

{% highlight javascript %}
const settings = plugin.settings();

settings.name('General');
settings.add({ key: 'enabled', name: 'Enabled', default: true });

settings.page('Advanced').add({ key: 'debug', name: 'Debug mode' });
{% endhighlight %}
