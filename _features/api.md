---
title: Public API
date: 2019-12-30
version: 0.30.0
banner: 
credit: 
notice: 
requested-by: CMD_God
---
Underscript exposes a public API via the variable `underscript`.

## Methods
{% for page in site.api %}
  {% if page.categories contains "underscript" and page.method %}
<a href="{{ page.url }}">{{ page.title }}</a>
: {{ page.excerpt }}
  {% endif %}
{% endfor %}

## Properties
{% for page in site.api %}
  {% if page.categories contains "underscript" and page.property %}
<a href="{{ page.url }}">{{ page.title }}</a>
: {{ page.excerpt }}
  {% endif %}
{% endfor %}

## Examples
```javascript
// Open 10 DR packs
underscript.openPacks(10, 'DR');

// Log to console if streaming
if (underscript.streamerMode()) console.log('Streaming!');

// Log to console if on pack page
if (underscript.onPage('Packs')) console.log('On Pack page!');
// or
underscript.onPage('Packs', () => console.log('On Pack page!'));
```
