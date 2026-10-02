---
title: plugin.quests
categories: plugin
plugin: true
property: true
---
Look up the user's quests.

## Syntax
> plugin.quests;

## Methods
getQuests()
: The quests UnderScript currently has. This is empty until `update()` has been called.

update()
: Get the latest quests. Returns a promise for `{ quests, previous }`.

## Quests
{% highlight javascript %}
Quest {
  id,
  name,
  reward, // { reward, type }
  progress, // { value, max, complete }
  claimable,
  claimed,
}
{% endhighlight %}

The `questProgress` event is emitted with the updated and the previous quests whenever progress changes.

## Examples
{% highlight javascript %}
plugin.quests.update().then(({ quests, previous }) => {
  console.log(quests.filter((quest) => quest.claimable));
});
{% endhighlight %}
