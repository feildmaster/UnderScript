---
title: underscript.plugin()
categories: underscript
method: true
---
The Plugin API is a service made to allow elevated access to UnderScript's internals.

## Syntax
> underscript.plugin(*name*);

name
: Name of plugin (See [name restrictions](#restrictions))

Return Value
: Returns `Plugin` object

## Methods
{% for page in site.api %}
  {% if page.plugin and page.method %}
<a href="{{ page.url | relative_url }}">{{ page.title }}</a>
: {{ page.excerpt }}
  {% endif %}
{% endfor %}

## Properties
{% for page in site.api %}
  {% if page.plugin and page.property %}
<a href="{{ page.url | relative_url }}">{{ page.title }}</a>
: {{ page.excerpt }}
  {% endif %}
{% endfor %}

## Restrictions
Plugin names have the following restrictions:

1. No two plugins may share the same name
2. Plugin names cant be longer than 20 characters
3. Plugin names can only contain alphanumeric characters and space (A-Z0-9 )

Any plugin names outside these bounds will trigger an error and not create a plugin
