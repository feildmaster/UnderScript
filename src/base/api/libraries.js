wrap(() => {
  const lib = api.module.lib;
  lib.tippy = tippy;
  lib.axios = axios;
  lib.luxon = luxon;
  lib.showdown = showdown;
});
