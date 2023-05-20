import eventManager from '../../utils/eventManager.js';

eventManager.on(':loaded', () => {
  const el = document.createElement('link');
  el.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  el.rel = 'stylesheet';
  document.head.append(el);
});
