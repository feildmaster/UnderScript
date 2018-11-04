---
title: UnderScript
---

## Setup ##
<ul class="setup">
  <li><a class="buttons install" href="https://tampermonkey.net/">Tampermonkey</a></li>
  <li><a class="buttons install" href="./undercards.user.js">UnderScript</a></li>
</ul>
![Install UnderScript](/assets/features/installscript.png)

## Features ##

<ul>
{% assign features = site.features | sort: "date" %}
{% for feature in features %}
  <li>
    {% if feature.deprecated %}<del>{% endif %}{{ feature.title }}{% if feature.deprecated %}</del>{% endif %}
    {% if feature.banner %}{% assign banner = site.static_files | where: "name", feature.banner | first %}
    {% if banner %}<br><img src="{{banner.path | relative_url }}">{% endif %}{% endif %}
  </li>
{% endfor %}
</ul>
