import alert_ringtone from "../assets/alert.mp3";
import start_ringtone from "../assets/start_ton.mp3";
import test_ringtone from "../assets/test.mp3";
import enter_ringtone from "../assets/short-punchy-sine-wave-ding-2-c-211742.mp3";
import error_ringtone from "../assets/echo-105584.mp3";
import leave_ringtone from "../assets/leave.mp3";
import active_ringtone from "../assets/notification-291230.mp3";
import disconnect_ringtone from "../assets/notification-disable-291235.mp3";
import raise_hand from "../assets/send_signal.mp3";
import lower_hand from "../assets/receive_signal.mp3";

export const ringtones_urls = {
  alert: alert_ringtone,
  start: alert_ringtone,
  test: test_ringtone,
  enter: enter_ringtone,
  error: error_ringtone,
  leave: leave_ringtone,
  active: active_ringtone,
  disconnect: disconnect_ringtone,
  raise: raise_hand,
  lower: lower_hand,
};

const ringtones = {
  alert: new Audio(alert_ringtone),
  start: new Audio(start_ringtone),
  test: new Audio(test_ringtone),
  enter: new Audio(enter_ringtone),
  error: new Audio(error_ringtone),
  leave: new Audio(leave_ringtone),
  active: new Audio(active_ringtone),
  disconnect: new Audio(disconnect_ringtone),
  raise: new Audio(raise_hand),
  lower: new Audio(lower_hand),
};

export const vibrates = {
  alert: () => navigator?.vibrate([100, 50, 100]),
  //start,
};

export default ringtones; //navigator.vibrate([100, 50, 100]);
