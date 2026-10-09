---
title: underscript.user
categories: underscript
property: true
---
Information about the logged in user. Everything that looks things up returns a promise.

## Syntax
> underscript.user;

## Methods
getCollection()
: The user's card collection

getDecks()
: The user's decks, by soul

getArtifacts()
: The artifacts the user owns

getAllArtifacts()
: Every artifact in the game

getUCP()
: How much UCP the user has

getCardSkins()
: The card skins the user owns

ignore(*user*), unIgnore(*user*), isIgnored(*user*)
: Ignore a chat user, stop ignoring them, or check. `user` is an object with a `username` and/or an `id`.

isMod(*user*), isStaff(*user*)
: Check if a chat user is a moderator, or staff. `user` is an object with a `mainGroup`.

## Examples
{% highlight javascript %}
underscript.user.getUCP().then((ucp) => console.log(`You have ${ucp} UCP`));
{% endhighlight %}
