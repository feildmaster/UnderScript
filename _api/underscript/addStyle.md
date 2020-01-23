---
title: underscript.addStyle()
method: true
---
Add CSS to the document.

## Syntax
> underscript.addStyle(...styles);

...styles
: Styles to add to the document

Return Value
: Returns `Modifier Object`
```js
{
  remove(),
  replace(...styles),
  append(...styles),
}
```

## Examples
```js
const style = underscript.addStyle('style1 {}'); // Styles: style1
style.remove(); // Styles: none
style.replace('style2 {}'); // Styles: style2
style.append('style3 {}', 'style4 {}'); // Styles: style2, style3, style4
```
