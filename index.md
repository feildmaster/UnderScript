---
title: UnderScript
---

## Setup ##
<span class="notice">UnderScript is not supported on mobile devices</span>
<ul class="setup">
  <li><a class="buttons install" href="https://tampermonkey.net/" target="_blank">Tampermonkey</a></li>
  <li><a class="buttons install" href="https://unpkg.com/underscript">UnderScript</a></li>
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
