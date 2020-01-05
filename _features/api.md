---
title: Plugin API
date: 2019-12-30
version: 0.30.0
banner: 
credit: 
notice: 
requested-by: CMD_God
---
Underscript exposes a public API via the variable `underscript`. 

<h2 class="no_toc">Methods</h2>
* TOC
{:toc}

### openPacks()
Opens packs and outputs the results.
<h4 class="no_toc">Syntax</h4>
> underscript.openPacks(*count*, *type*);

<h4 class="no_toc">Parameters</h4>
count
: Number of packs to open

type
: Type of pack to open ('', 'DR', 'Shiny', 'Super', 'Final') (default: '')

### streamerMode()
<h4 class="no_toc">Syntax</h4>
> underscript.streamerMode(); // Returns true if streamer mode enabled, otherwise false

### onPage()
<h4 class="no_toc">Syntax</h4>
> underscript.onPage(*name*, *fn*);

<h4 class="no_toc">Parameters</h4>
name
: Name of page to check

fn
: callback function, optional, gets called if on page

Return Value
: true if on page

### eventManager()
Listen to and emit events.
<h4 class="no_toc">Syntax</h4>
> underscript.eventManager();

<h4 class="no_toc">Methods</h4>
* on
* emit

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

// Event Manager
const eventManager = underscript.eventManager();
eventManager.on(':load', () => console.log('Page finished loading'));

eventManager.emit('customevent', {foo: 'bar'});
eventManager.on('customevent', (data) => console.log(data.foo));
```
