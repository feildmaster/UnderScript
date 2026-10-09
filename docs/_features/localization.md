---
title: UnderScript Localization
date: 2025-07-01
version: 0.63.0
---

UnderScript's own text, like its settings, menu, toasts and chat commands, can be translated, and is shown in the language you picked for the game. English is the only language included so far.

## Adding a language ##
Translations live in the `lang` folder of the [UnderScript repository](https://github.com/UCProjects/UnderScript), with a folder for each language, named with the same code the game uses, like `fr` or `de`. `en` has everything, and is the one to copy from. It has these files:

* `command.json`, for chat commands
* `general.json`, for text used in many places
* `menu.json`, for the UnderScript menu
* `settings.json`, for settings and their descriptions
* `toast.json`, for toasts

Copy them into a new folder and translate the values, keeping the keys the same. A `~` key holds the main text of an entry, and the keys next to it are its extras, like a note or usage.

Send the new folder as a pull request. Don't add `lang/underscript.json`, it is built from the language folders automatically.
