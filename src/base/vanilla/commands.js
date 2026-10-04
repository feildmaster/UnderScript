import { isPriority, self } from 'src/utils/user.js';
import { register } from 'src/utils/chatCommands.js';
import Translation from 'src/structures/constants/translation.js';

function moderation(command, priority, usage) {
  register({
    command,
    usage: usage && Translation.Command(`${command}.usage`),
    enabled: () => isPriority(self(), priority),
  });
}

moderation('broadcast', 3, true);
moderation('to', 4, true);
moderation('unto', 4, true);
moderation('ban', 3, true);
moderation('unban', 3, true);
