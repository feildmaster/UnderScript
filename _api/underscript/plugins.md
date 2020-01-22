---
title: underscript.plugin()
method: true
---
The Plugin API is a service made to allow elevated access to UnderScript's internals.

## Methods
{% for page in site.api %}
  {% if page.plugin and page.method %}
<a href="{{ page.url }}">{{ page.title }}</a>
: {{ page.excerpt }}
  {% endif %}
{% endfor %}
