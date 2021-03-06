wrap(() => {
  const setting = settings.register({
    name: 'Disable Collect All',
    key: 'underscript.disable.friendship.collect',
    page: 'Library',
    category: 'Friendship',
  });

  onPage('Friendship', () => {
    const maxClaim = 200 / 5; // Current level limit, no way to dynamically figure this out if he ever adds more rewards
    let button;
    let collecting = false;
    const rewards = {};
    let pending = 0;

    function canClaim({ notClaimed, claim }) {
      return notClaimed && claim < maxClaim;
    }

    function canCollect() {
      return fn.some(global('friendshipItems'), canClaim);
    }

    function claimReward(data) {
      if (canClaim(data)) {
        global('claim')(data.idCard);
        pending += 1;
      }
    }

    function collect() {
      if (!canCollect() || collecting) return;
      collecting = true;
      pending = 0;
      fn.clear(rewards);
      fn.each(global('friendshipItems'), claimReward);
    }

    function getLabel(type = '') {
      switch (type) {
        case 'GOLD': return '<img src="/images/icons/gold.png" class="height-16">';
        case 'DUST': return '<img src="/images/icons/dust.png" class="height-16">';
        case 'PACK': return '<img src="/images/icons/pack.png" class="height-16">';
        case 'DR_PACK': return '<img src="/images/icons/drPack.png" class="height-16">';
        default: return type.toLowerCase();
      }
    }

    eventManager.on('Friendship:loaded', () => {
      button.prop('disabled', setting.value() || !canCollect());
    });

    setting.on(({ val: disabled }) => {
      if (disabled) {
        button.addClass('hidden');
      } else {
        button.removeClass('hidden')
          .prop('disabled', setting.value() || !canCollect());
      }
    });

    eventManager.on('Friendship:claim', ({
      data, reward, quantity, error,
    }) => {
      if (!pending || !collecting) return;
      pending -= 1;

      if (!error) {
        rewards[reward] = (rewards[reward] || 0) + quantity;

        // Claim again if necessary
        claimReward(data);
      }

      if (pending) return;

      eventManager.emit('Friendship:results', error);
    });

    eventManager.on('Friendship:results', (error) => {
      const lines = [];
      fn.each(rewards, (count, type) => {
        lines.push(`- ${count} ${getLabel(type)}`);
      });
      const toast = error ? fn.errorToast : fn.toast;
      toast({
        title: 'Claimed Friendship Rewards',
        text: lines.join('<br>'),
      });
      button.prop('disabled', !canCollect());
      collecting = false;
    });

    eventManager.on(':loaded', () => {
      button = $('<button class="btn btn-info">Collect All</button>');
      if (setting.value()) {
        button.addClass('hidden');
      }
      button.prop('disabled', true);
      button.on('click.script', collect);
      button.hover(hover.show('Collect all rewards'));
      $('p[data-i18n="[html]crafting-all-cards"]').css('display', 'inline-block').after(' ', button);
    });
  });
});
