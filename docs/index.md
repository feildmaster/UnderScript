---
title: UnderScript
---

## Setup ##

1. Install [Tampermonkey](https://tampermonkey.net/) (recommended), [Violentmonkey](https://violentmonkey.github.io/), or some other obscure script program for your browser
2. Open **[undercards.user.js](/undercards.user.js)** (Tampermonkey should pop up)<br>![Install UnderScript](/assets/features/installscript.png)

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
