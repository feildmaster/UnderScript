import eventManager from '../utils/eventManager';
import onPage from '../utils/onPage';

eventManager.on(':loaded', () => {
  if (onPage('Settings') || onPage('SignUp') || onPage('SignIn')) return;
  const type = 'input[type="text"]';
  [...document.querySelectorAll(type)].forEach((el) => {
    el.dataset.lpignore = true;
  });

  eventManager.on('Chat:getHistory', (data) => {
    document.querySelector(`#${data.room} ${type}`).dataset.lpignore = true;
  });
});
