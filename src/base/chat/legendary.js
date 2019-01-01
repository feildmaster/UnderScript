(() => {
  settings.register({
    name: 'Card Draw Announcement',
    key: 'underscript.announcement.draws',
    type: 'select',
    options: ['chat', 'toast', 'both', 'hidden'],
    default: 'toast',
    page: 'Chat',
  });

  const toasts = [];
  let toastIndex = 0;
  eventManager.on('preChat:getMessageAuto', function drawAnnouncement(data) {
    const setting = settings.value('underscript.announcement.draws');
    if (this.canceled || setting === 'chat' || !data.message.includes('has just obtained')) return;
    const both = setting === 'both';
    this.canceled = !both;
    if (both || setting === 'toast') {
      if (toasts[toastIndex % 3]) { // Close any old toast
        toasts[toastIndex % 3].close();
      }
      toasts[toastIndex % 3] = fn.toast({
        text: data.message,
        css: {
          color: 'yellow',
          footer: {color: 'white'},
        }
      });
      toastIndex += 1;
    }
  });
})();
