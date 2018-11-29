const underscript = {
  latest: undefined,
  version: undefined,
};

function setVersion(version) {
  underscript.version = version;
  const list = document.getElementsByClassName('setup')[0].children;
  // Just hide the tampermonkey button
  list[0].style.display = 'none';
  // Mark that the script has been installed
  list[1].children[0].className = 'buttons installed';
  // In case axios updated really quick
  checkUpdate();
}

function checkUpdate() {
  const {version, latest} = underscript;
  if (!(version && latest)) return;
  if (latest !== version) {
    document.getElementsByClassName('setup')[0].children[1].children[0].className = 'buttons update';
  }
}

axios.get('https://unpkg.com/underscript/package.json').then((response) => {
  underscript.latest = response.data.version;
  checkUpdate();
});
