settings.register({
  name: 'Card Draw Announcement',
  key: 'underscript.announcement.draws',
  type: 'select',
  options: ['chat', 'toast', 'hidden'],
});

eventManager.on('preChat:getMessageAuto', function drawAnnouncement(data) {
  const setting = settings.value('underscript.announcement.draws');
  if (this.canceled || setting === 'chat' || !data.message.includes('has just obtained')) return;
  this.canceled = true;
  if (setting === 'toast') {
    fn.toast(data.message);
  }
});
