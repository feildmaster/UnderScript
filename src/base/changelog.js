// Change log :O
const changelog = wrap(function changelog() {
  style.add(
    '.us-changelog h2 { font-size: 24px; }',
    '.us-changelog h3 { font-size: 20px; }',
  );
  function getMarkdown() {
    if (!changelog.markdown) {
      changelog.markdown = new showdown.Converter({noHeaderId: true, strikethrough: true, disableForced4SpacesIndentedSublists: true});
    }
    return changelog.markdown;
  }
  function getAxios() {
    if (!changelog.axios) {
      changelog.axios = axios.create({baseURL: 'https://unpkg.com/'});
    }
    return changelog.axios;
  }

  function open(message) {
    BootstrapDialog.show({
      message,
      title: 'UnderScript Change Log',
      cssClass: 'mono us-changelog',
      buttons: [{
        label: 'Close',
        action(self) {
          self.close();
        },
      }],
    });
  }

  function get(version = 'latest', short = false) {
    const cache = version.includes('.');
    const key = `${version}${short?'_short':''}`;
    if (cache && changelog[key]) return Promise.resolve(changelog[key]);

    const extension = `underscript@${version}/changelog.md`;
    return getAxios().get(extension).then(({data: text}) => {
      const first = text.indexOf(`\n## ${cache?`Version ${version}`:''}`);
      let end = undefined;
      if (!~first) throw new Error('Invalid Changelog');
      if (short) {
        const index = text.indexOf('\n## ', first + 1);
        if (!!~index) end = index;
      }
      const parsedHTML = getMarkdown().makeHtml(text.substring(first, end).trim()).replace(/\r?\n/g, '');
      // Cache results
      if (cache) changelog[key] = parsedHTML;
      return parsedHTML;
    });
  }

  function load(version = 'latest', short = false) {
    const container = $('<div>').text('Please wait');
    open(container);
    get(version, short).catch((e) => {
      console.error(e);
      return 'Unavailable at this time'; 
    }).then((m) => container.html(m));
  }

  // Add menu button
  menu.addButton({
    text: 'UnderScript Change Log',
    action() {
      load(scriptVersion === 'L' ? 'latest' : scriptVersion);
    },
    enabled() {
      return typeof BootstrapDialog !== 'undefined';
    },
    note() {
      if (!this.enabled()) {
        return 'Unavailable on this page';
      }
    },
  });

  return {
    load, get,
  };
});
