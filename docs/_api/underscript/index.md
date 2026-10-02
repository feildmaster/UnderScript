---
title: UnderScript Object
categories: underscript
---
## Methods
{% for page in site.api %}
  {% if page.categories contains "underscript" and page.method %}
<a href="{{ page.url | relative_url }}">{{ page.title }}</a>
: {{ page.excerpt }}
  {% endif %}
{% endfor %}

## Properties
{% for page in site.api %}
  {% if page.categories contains "underscript" and page.property %}
<a href="{{ page.url | relative_url }}">{{ page.title }}</a>
: {{ page.excerpt }}
  {% endif %}
{% endfor %}