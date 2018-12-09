---
title: UnderScript
---

## What is UnderScript? ##
UnderScript is a userscript (made with javascript) that gets loaded by a script manager to change the behavior of undercards. These changes range from fixing bugs (removing ghost mines from the board) to adding features (a battle log). There are {{ site.features.size }} features and counting for UnderScript, and is fairly popular and completely safe to use. UnderScript will never add anything to harm your computer or account, nor will it ever feature anything considered "hacking" or get you banned.

### Why Tampermonkey? ###
Tampermonkey is a script manager program that loads scripts automatically, and is supported on all major browsers, so you don't have to do anything extra yourself.

## Setup ##
<span class="notice">UnderScript is not supported on mobile devices</span>
<ul class="setup">
  <li><a class="buttons install" href="https://tampermonkey.net/" target="_blank">Tampermonkey</a></li>
  <li><a class="buttons install" href="https://unpkg.com/underscript">UnderScript</a></li>
</ul>
![Install UnderScript](/assets/features/installscript.png)

## Features ##

<ol>
{% assign features = site.features | sort: "date" %}
{% for feature in features %}
  <li id="feature-{{forloop.index}}">
    {% if feature.deprecated %}<del>{% endif %}{{ feature.title }}{% if feature.deprecated %}</del>{% endif %}
    {% if feature.banner %}{% assign banner = site.static_files | where: "name", feature.banner | first %}
    {% if banner %}<br><img src="{{banner.path | relative_url }}">{% endif %}{% endif %}
  </li>
{% endfor %}
</ol>
