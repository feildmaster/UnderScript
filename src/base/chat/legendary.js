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
  function getToast(owner) {
    const now = Date.now();
    for (let i = 0; i < toasts.length; i++) {
      const toast = toasts[i];
      if (toast && toast.exists() && owner === toast.owner && toast.time + 1000 > now) {
        return toast;
      }
    }
    return null;
  }

  eventManager.on('preChat:getMessageAuto', function drawAnnouncement(data) {
    const setting = settings.value('underscript.announcement.draws');
    const index = data.message.indexOf(' has just obtained ');
    if (this.canceled || setting === 'chat' || !~index) return;
    const both = setting === 'both';
    this.canceled = !both;
    if (both || setting === 'toast') {
      const owner = data.message.substring(0, index);
      const card = data.message.substring(index + 19, data.message.length - 2);

      const last = getToast(owner);
      if (last) {
        const text = `${owner} has just obtained ${last.cards.join(', ')} and ${card} !`;
        last.setText(text);
        toast.time = Date.now(); // This toast is still relevant!
        last.cards.push(card);
        return;
      }
      if (toasts[toastIndex]) { // Close any old toast
        toasts[toastIndex].close();
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
      toasts[toastIndex] = toast;
      toastIndex = (toastIndex + 1) % 3;
    }
  });
})();
