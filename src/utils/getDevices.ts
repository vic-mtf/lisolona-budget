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
  return { cameras, microphones, speakers, screens };
};

export const stopStream = (stream, type = "all") => {
  if (!stream) return;
  stream.getTracks().forEach((track) => {
    if (
      type === "all" ||
      (type === "audio" && track.kind === "audio") ||
      (type === "video" && track.kind === "video")
    ) {
      track.stop();
    }
  });
};

if (navigator.mediaDevices.ondevicechange === null)
  navigator.mediaDevices.ondevicechange = async () => {
    const { cameras, microphones, speakers, screens } = await getDevices();
    const key = [
      "setup.devices.cameras",
      "setup.devices.microphones",
      "setup.devices.speakers",
      "setup.devices.screens",
    ];

    const data = [cameras, microphones, speakers, screens];
    store.dispatch(updateConferenceData({ data, key }));
  };

export default getDevices;
