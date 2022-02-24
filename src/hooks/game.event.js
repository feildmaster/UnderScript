import eventManager from '../utils/eventManager';
import { debug, debugToast } from '../utils/debug';

eventManager.on('GameStart', function gameEvents() {
  let finished = false;
  eventManager.on('GameEvent', function logEvent(data) {
    if (finished) { // Sometimes we get events after the battle is over
      debugToast(`Extra action: ${data.action}`, 'debugging.events.extra');
      return;
    }
    debug(data.action, 'debugging.events.name');
    debug(data, 'debugging.events.raw');
    const emitted = eventManager.emit(data.action, data).ran;
    if (!emitted) {
      debugToast(`Unknown action: ${data.action}`);
    }
  });
  eventManager.on('PreGameEvent', function callPreEvent(data) {
    if (finished) return;
    const emit = this.cancelable ? eventManager.cancelable.emit : eventManager.emit;
    const event = emit(`${data.action}:before`, data);
    if (!event.ran) return;
    this.canceled = event.canceled;
  });
  eventManager.on('getVictory getDefeat getResult', function finish() {
    finished = true;
  });
  eventManager.on('getBattleLog', (data) => {
    const log = JSON.parse(data.battleLog);
    const { ran } = eventManager.emit(`Log:${log.battleLogType}`, log);
    if (!ran) {
      debugToast(`Unknown action: Log:${data.battleLogType}`);
    }
  });
});
