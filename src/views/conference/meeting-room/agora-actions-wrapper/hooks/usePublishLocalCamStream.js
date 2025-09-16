import AgoraRTC, { useRTCClient } from "agora-rtc-react";
import { useEffect } from "react";
import { streamSegmenterMediaPipe } from "../../../../../utils/StreamSegmenterMediaPipe";
import { useSelector } from "react-redux";

let publishing = false;

const usePublishLocalCamStream = (isConnected) => {
  const isCamActive = useSelector(
    (store) => store.conference.setup.devices.camera.enabled
  );
  const agoraClient = useRTCClient();
  const isPublished = agoraClient?.localTracks.some(
    ({ trackMediaType }) => trackMediaType === "video"
  );
  useEffect(() => {
    const stream = streamSegmenterMediaPipe.getProcessedStream();
    const cond = [
      !isConnected,
      !agoraClient,
      isPublished,
      !isCamActive,
      !stream,
      publishing,
    ];
    if (cond.some((c) => c)) return;
    async function publishLocalCamStream() {
      publishing = true;
      const [mediaStreamTrack] = stream.getVideoTracks();
      const localVideoTrack = AgoraRTC.createCustomVideoTrack({
        mediaStreamTrack,
      });
      await agoraClient.publish(localVideoTrack);

      publishing = false;
    }
    publishLocalCamStream();
  }, [isConnected, agoraClient, isPublished, isCamActive]);

  return null;
};

export default usePublishLocalCamStream;
