---
title: Plugin Object
categories: plugin
---
## Methods
{% for page in site.api %}
  {% if page.plugin and page.method %}
<a href="{{ page.url }}">{{ page.title }}</a>
: {{ page.excerpt }}
  {% endif %}
{% endfor %}

## Properties
{% for page in site.api %}
  {% if page.plugin and page.property %}
<a href="{{ page.url }}">{{ page.title }}</a>
: {{ page.excerpt }}
  {% endif %}
{% endfor %}
