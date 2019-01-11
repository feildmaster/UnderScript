eventManager.on(':loaded', function () {
  if (onPage('Settings') || onPage('SignUp') || onPage('SignIn')) return;
  const type = 'input[type="text"]';
  [...document.querySelectorAll(type)].forEach((el) => {
    el.dataset.lpignore = true;
  });

  eventManager.on('Chat:getHistory', function (data) {
    document.querySelector(`#${data.room} ${type}`).dataset.lpignore = true;
  });
});
