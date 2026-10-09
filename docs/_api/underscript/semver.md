---
title: underscript.semver
categories: underscript
property: true
---
Compare versions. Each method compares a version you give it to a second version, `current`, which defaults to the version of UnderScript that is running. That makes it useful for checking if a feature exists.

`meets` and `isBehind` read naturally when `current` is UnderScript: "does UnderScript meet 0.65.0?" is `meets('0.65.0')`. The functions `isNewer`, `isOlder`, and `atLeast` describe the version you pass, compared to `current`, so the same question is answered by `isOlder('0.65.0')`.

## Syntax
> underscript.semver.meets(*version*, *current*);<br>
> underscript.semver.isBehind(*version*, *current*);<br>
> underscript.semver.isNewer(*version*, *current*);<br>
> underscript.semver.isOlder(*version*, *current*);<br>
> underscript.semver.atLeast(*version*, *current*);<br>
> underscript.semver.compare(*newer*, *current*);

meets
: `true` if `current` is `version` or newer. When `current` is UnderScript, that means UnderScript has everything from `version`.

isBehind
: `true` if `current` is older than `version`. When `current` is UnderScript, that means UnderScript is too old.

isNewer
: `true` if `version` is newer than `current`. Same result as `isBehind`.

isOlder
: `true` if `version` is older than, or the same as, `current`. Same result as `meets`.

atLeast
: `true` if `version` is newer than, or the same as, `current`

compare
: `true` if `newer` is newer than `current`, `false` if it is older, and `undefined` if they are the same. Both versions are required.

Local builds of UnderScript count as newer than everything.

## Examples
{% highlight javascript %}
// Is UnderScript at least 0.65.0?
if (underscript.semver.meets('0.65.0')) {
  // Use something added in 0.65.0
}

// Is UnderScript too old for my plugin?
if (underscript.semver.isBehind('0.65.0')) {
  console.log('Please update UnderScript!');
}

underscript.semver.isNewer('1.2.0', '1.1.9'); // true
{% endhighlight %}
