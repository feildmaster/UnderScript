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
    const index = data.message.indexOf(' has just obtained ');
    if (this.canceled || setting === 'chat' || !~index) return;
    const both = setting === 'both';
    this.canceled = !both;
    if (both || setting === 'toast') {
      const owner = data.message.substring(0, index);
      const card = data.message.substring(index + 19, data.message.length - 2);

      const last = toastIndex > 0 && toasts[(toastIndex - 1)%3];
      if (last && last.exists() && (true || last.time + 1000 > Date.now())) {
        if (owner === last.owner) {
          const text = `${owner} has just obtained ${last.cards.join(', ')} and ${card} !`;
          last.setText(text);
          last.cards.push(card);
          return;
        }
      }
      if (toasts[toastIndex % 3]) { // Close any old toast
        toasts[toastIndex % 3].close();
      }
      
      const toast = fn.toast({
        text: data.message,
        css: {
          color: 'yellow',
          footer: {color: 'white'},
        }
      });
      toast.cards = [card];
      toast.owner = owner;
      toast.time = Date.now();
      toasts[toastIndex % 3] = toast;
      toastIndex += 1;
    }
  });
})();
