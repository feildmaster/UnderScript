(() => {
  settings.register({
    name: 'Card Draw Announcement',
    key: 'underscript.announcement.draws',
    type: 'select',
    options: ['chat', 'toast', 'hidden'],
  });

  const toasts = [];
  let toastIndex = 0;
  eventManager.on('preChat:getMessageAuto', function drawAnnouncement(data) {
    const setting = settings.value('underscript.announcement.draws');
    if (this.canceled || setting === 'chat' || !data.message.includes('has just obtained')) return;
    this.canceled = true;
    if (setting === 'toast') {
      if (toasts[toastIndex % 3]) { // Close any old toast
        toasts[toastIndex % 3].close();
      }
      toasts[toastIndex % 3] = fn.toast(data.message);
      toastIndex += 1;
    }
  });
})();