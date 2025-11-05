import AgoraRTC, { useRTCClient } from 'agora-rtc-react';
import { useEffect } from 'react';
import { streamSegmenterMediaPipe } from '../../../../../utils/StreamSegmenterMediaPipe';
import { useSelector } from 'react-redux';
import useSocket from '../../../../../hooks/useSocket';

let publishing = false;

const usePublishLocalCamStream = (isConnected) => {
  const socket = useSocket();
  const isCamActive = useSelector(
    (store) => store.conference.setup.devices.camera.enabled
  );
  const agoraClient = useRTCClient();
  const isPublished = agoraClient?.localTracks.some(
    ({ trackMediaType }) => trackMediaType === 'video'
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
      socket?.emit('signal-room', { state: { isCamActive } });
      publishing = false;
    }
    publishLocalCamStream();
  }, [isConnected, agoraClient, isPublished, isCamActive, socket]);

  return null;
};

export default usePublishLocalCamStream;
