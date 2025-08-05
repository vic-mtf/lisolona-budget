import alert_ringtone from "../assets/alert.mp3";
import start_ringtone from "../assets/start_ton.mp3";
import test_ringtone from "../assets/test.mp3";

export const ringtones_urls = {
  alert: alert_ringtone,
  start: alert_ringtone,
  test: test_ringtone,
};

const ringtones = {
  alert: new Audio(alert_ringtone),
  start: new Audio(start_ringtone),
  test: new Audio(test_ringtone),
};

export const vibrates = {
  alert: () => navigator?.vibrate([100, 50, 100]),
  //start,
};

export default ringtones; //navigator.vibrate([100, 50, 100]);
