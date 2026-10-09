---
title: UnderScript Localization
date: 2025-07-01
version: 0.63.0
---

UnderScript's own text, like its settings, menu, toasts and chat commands, can be translated, and is shown in the language you picked for the game. Anything without a translation shows in English.

## Adding a language ##
Translations live in the `lang` folder of the [UnderScript repository](https://github.com/UCProjects/UnderScript), with a folder for each language, named with the code the game uses, like `fr` or `de`. The English text is in `lang/en`.

To start a new language, clone the repository and generate a template. You need [Node.js](https://nodejs.org/) 18 or newer.

{% highlight sh %}
npm install
npm run lang -- fr
{% endhighlight %}

This creates `lang/fr` with a file for each file that exists in English. Every string appears twice, a `//` line with the English text for reference, and the real key with an empty value for you to fill in.

{% highlight json %}
"//dismiss": "Dismiss",
"dismiss": "Fermer"
{% endhighlight %}

* Only edit the values, and leave the `//` lines alone
* Strings left empty show in English, so a partial translation is fine. A list of strings is only used once every entry in it is filled in
* Keep placeholders such as `$1` and `{% raw %}{{...}}{% endraw %}` exactly as they are
* Run the command again after pulling changes. It adds new strings, never overwrites your translations, and tells you how many are left in each file
* If the English text of a string you already translated changes, its `//` line becomes `//dismiss!`. Review your translation, then remove the `!` to clear it

Send the new folder as a pull request. Don't add `lang/underscript.json`, it is built from the language folders automatically. The [readme](https://github.com/UCProjects/UnderScript#translations) has the full details.
