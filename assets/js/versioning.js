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
    document.getElementById('install').className = 'buttons update';
  }
}

axios.get('https://unpkg.com/underscript/package.json').then((response) => {
  console.log(response.data);
  const version = response.data.version;
  underscript.latest = version;
  const install = document.getElementById('install');
  install.textContent = `UnderScript (${version})`;
  install.href = `https://unpkg.com/underscript@${version}/${response.data.unpkg}`
  checkUpdate();
});
