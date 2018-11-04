function debug(message, permission = 'debugging') {
  if (localStorage.getItem(permission) !== "true") return;
  console.log(message);
}
