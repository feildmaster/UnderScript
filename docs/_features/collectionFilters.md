---
title: Collection filters
banner: collectionFilters.png
date: 2024-04-01
version: 0.57.0
---

More ways to find cards on the Decks and Crafting pages.

* A tribe button
* A collection dropdown on the Crafting page, to show all, owned, unowned, maxed, surplus or craftable cards
* A shiny filter, with the option to merge shiny cards with their normal version: never, on the Decks page, on the Crafting page, or always
* Split base and token cards
* Trim the filter buttons so they look less cluttered

![The collection dropdown]({{ '/assets/features/collectionFiltersDropdown.png' | relative_url }})

Plugins can add their own filters too, with [plugin.addFilter()]({{ site.baseurl }}{% link _api/plugin/addFilter.md %}). These options are in the Library settings, where the whole thing can be turned off.

For comparison, this is how the game shows the filters, with a checkbox next to every button.

![The game's own filters]({{ '/assets/features/collectionFiltersVanilla.png' | relative_url }})
