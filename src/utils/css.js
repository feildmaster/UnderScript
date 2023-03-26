export default function css(strings = [], ...values) {
  const evaluated = strings.reduce((acc, string, i) => {
    if (string) {
      acc.push(string
        .trimStart()
        // .replace(/[ ]{2}/g, ' ')
        // trim "  }" and "  \n"
        .replace(/^[ ]+(?<last>[\n}])/gm, '$<last>')
        // trim "  *"
        .replace(/(?:^|})\n+[ ]{1,2}(?<last>[^ /])/gm, '}\n\n$<last>'));
    }
    const value = values[i];
    if (value) acc.push(value.toString());
    return acc;
  }, []);

  return evaluated.join('').split('\n\n');
}
