import { updateConferenceData } from "../redux/conference/conference";
import store from "../redux/store";

const getDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const serialize = (device) => ({
    deviceId: device.deviceId,
    //groupId: device.groupId,
    kind: device.kind,
    label: device.label,
  });
  const filter = (kind) => (device) => device.kind === kind;
  const cameras = devices.filter(filter("videoinput")).map(serialize);
  const microphones = devices.filter(filter("audioinput")).map(serialize);
  const speakers = devices.filter(filter("audiooutput")).map(serialize);
  const screens = devices.filter(filter("videoinput")).map(serialize);
  console.log(cameras, microphones, speakers, screens);
  return { cameras, microphones, speakers, screens };
};

navigator.mediaDevices?.addEventListener("devicechange", async () => {
  const { cameras, microphones, speakers, screens } = await getDevices();
  const key = [
    "setup.devices.cameras",
    "setup.devices.microphones",
    "setup.devices.speakers",
    "setup.devices.screens",
  ];
  const data = [cameras, microphones, speakers, screens];
  store.dispatch(updateConferenceData({ data, key }));
});

export default getDevices;
