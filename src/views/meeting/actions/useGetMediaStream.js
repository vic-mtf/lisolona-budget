import AgoraRTC from "agora-rtc-react";
import store from "../../../redux/store";
import { useData } from "../../../utils/DataProvider";
import { useMeetingData } from "../../../utils/MeetingProvider";
import { setData } from "../../../redux/meeting";
import { useCallback } from "react";

export default function useGetMediaStream() {
  const [{ videoStreamRef, audioStreamRef, mediaStreamRef }] = useData();
  const [{ localTrackRef }] = useMeetingData();

  const handleGetMediaStream = useCallback(
    (typeMedia) => {
      const media =
        typeMedia === "video" || typeMedia === "audio" ? typeMedia : null;
      const videoDevice = store.getState().meeting.video.input;
      const audioDevice = store.getState().meeting.audio.input;
      const audioConfig =
        media === "audio" || media === null
          ? { audio: audioDevice.deviceId ? audioDevice : true }
          : {};
      const videoConfig =
        media === "video" || media === null
          ? {
              video: videoDevice.deviceId
                ? videoDevice
                : {
                    width: videoDevice.width,
                    height: videoDevice.height,
                  },
            }
          : {};
      navigator?.mediaDevices
        ?.getUserMedia({ ...audioConfig, ...videoConfig })
        .then((stream) => {
          let [audioStreamTrack] = stream.getAudioTracks();
          let [videoStreamTrack] = stream.getVideoTracks();
          if (media === null) {
            mediaStreamRef.current = stream;
            audioStreamRef.current = new MediaStream();
            videoStreamRef.current = new MediaStream();
            audioStreamRef.current.addTrack(audioStreamTrack);
            videoStreamRef.current.addTrack(videoStreamTrack);
          }
          if (media === "audio") audioStreamRef.current = stream;
          if (media === "video") videoStreamRef.current = stream;
          const data = {};
          if (audioStreamTrack) {
            localTrackRef.current.audioTrack = AgoraRTC.createCustomAudioTrack({
              mediaStreamTrack: audioStreamTrack,
            });
            data.micro = { allowed: true, active: true };
          }
          if (videoStreamTrack) {
            localTrackRef.current.videoTrack = AgoraRTC.createCustomVideoTrack({
              mediaStreamTrack: videoStreamTrack,
            });
            data.camera = { allowed: true, active: true };
          }
          store.dispatch(setData({ data }));
        })
        .catch(() => {});
    },
    [videoStreamRef, audioStreamRef, mediaStreamRef, localTrackRef]
  );
  return handleGetMediaStream;
}
