---
title: underscript.semver
categories: underscript
property: true
---
Compare versions. Each method compares a version you give it to a second version, `current`, which defaults to the version of UnderScript that is running. That makes it useful for checking if a feature exists.

The names describe the version you pass, compared to `current`. This means "is UnderScript at least 0.65.0?" is asked with `isOlder('0.65.0')`.

## Syntax
> underscript.semver.isNewer(*version*, *current*);<br>
> underscript.semver.isOlder(*version*, *current*);<br>
> underscript.semver.atLeast(*version*, *current*);<br>
> underscript.semver.compare(*newer*, *current*);

isNewer
: `true` if `version` is newer than `current`. When `current` is UnderScript, that means UnderScript is too old.

isOlder
: `true` if `version` is older than, or the same as, `current`. When `current` is UnderScript, that means UnderScript is `version` or newer.

atLeast
: `true` if `version` is newer than, or the same as, `current`

compare
: `true` if `newer` is newer than `current`, `false` if it is older, and `undefined` if they are the same. Both versions are required.

Local builds of UnderScript count as newer than everything.

## Examples
{% highlight javascript %}
// Is UnderScript at least 0.65.0?
if (underscript.semver.isOlder('0.65.0')) {
  // Use something added in 0.65.0
}

// Is UnderScript too old for my plugin?
if (underscript.semver.isNewer('0.65.0')) {
  console.log('Please update UnderScript!');
}

underscript.semver.isNewer('1.2.0', '1.1.9'); // true
{% endhighlight %}
