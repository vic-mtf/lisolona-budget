import alert_ringtone from "../assets/alert.mp3";
import start_ringtone from "../assets/start_ton.mp3";

export const ringtones_urls = {
  alert: alert_ringtone,
  start: alert_ringtone,
};

const ringtones = {
  alert: new Audio(alert_ringtone),
  start: new Audio(start_ringtone),
};

export const vibrates = {
  alert: () => navigator?.vibrate([100, 50, 100]),
  //start,
};

export default ringtones; //navigator.vibrate([100, 50, 100]);
