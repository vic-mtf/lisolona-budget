import AgoraRTC, { useRTCClient } from 'agora-rtc-react';
import { useEffect } from 'react';
import { noiseSuppressor } from '../../../../../utils/NoiseSuppressor';
import { useSelector } from 'react-redux';
import useSocket from '../../../../../hooks/useSocket';

let publishing = false;

const usePublishLocalMicroStream = (isConnected) => {
  const isMicActive = useSelector(
    (store) => store.conference.setup.devices.microphone.enabled
  );
  const socket = useSocket();
  const agoraClient = useRTCClient();
  const isPublished = agoraClient?.localTracks.some(
    ({ trackMediaType }) => trackMediaType === 'audio'
  );
  useEffect(() => {
    const stream = noiseSuppressor.getProcessedStream();
    const cond = [
      !isConnected,
      !agoraClient,
      isPublished,
      !isMicActive,
      !stream,
      publishing,
    ];
    if (cond.some((c) => c)) return;
    async function publishLocalMicroStream() {
      publishing = true;
      const [mediaStreamTrack] = stream.getAudioTracks();
      const localAudioTrack = AgoraRTC.createCustomAudioTrack({
        mediaStreamTrack,
      });
      await agoraClient.publish(localAudioTrack);
      publishing = false;
      socket?.emit('signal-room', { state: { isMicActive } });
    }
    publishLocalMicroStream();
  }, [isConnected, agoraClient, isPublished, isMicActive, socket]);

  return null;
};

export default usePublishLocalMicroStream;
