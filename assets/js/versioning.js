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

axios.get('https://api.github.com/repos/UCProjects/UnderScript/releases/latest').then(({ data: { version, assets = [] } }) => {
  const file = assets.find(({ name = '' }) => name.endsWith('.user.js'))?.browser_download_url;
  if (!file) return;
  underscript.latest = version;
  const install = document.getElementById('install');
  install.textContent = `UnderScript (${version})`;
  install.href = '#';
  install.onclick = () => {
    window.open(file, 'updateUserScript', 'noreferrer');
  };
  checkUpdate();
});
