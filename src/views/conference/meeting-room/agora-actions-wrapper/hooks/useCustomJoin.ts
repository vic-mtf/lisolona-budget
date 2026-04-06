import { useRTCClient } from 'agora-rtc-react';
import { useState, useEffect } from 'react';
import { useMemo } from 'react';
import store from '@/redux/store';
import useSocket from '@/hooks/useSocket';
import { useSelector } from 'react-redux';

let loading = false;

const useCustomJoin = ({ APP_ID, CHANNEL, TOKEN, UID }, ready) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socket = useSocket();
  const roomId = useSelector((store) => store.conference.roomId);

  const userRTCClient = useRTCClient();

  useEffect(() => {
    if (isConnected || error || !ready || loading || !roomId) return;
    const userJoin = async () => {
      loading = true;
      setIsLoading(loading);
      try {
        await userRTCClient.join(APP_ID, CHANNEL, TOKEN, UID);
        const conference = store.getState().conference;
        const devices = conference.setup.devices;
        const isCamActive = devices.camera.enabled;
        const isMicActive = devices.microphone.enabled;
        const handRaised = conference.meeting.actions.raiseHand;
        socket.emit('join-room', {
          id: roomId,
          state: { isCamActive, isMicActive, handRaised },
        });
        setIsConnected(true);
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
      loading = false;
      setIsLoading(loading);
    };
    if (!loading) userJoin();
  }, [
    userRTCClient,
    isConnected,
    error,
    ready,
    APP_ID,
    CHANNEL,
    TOKEN,
    UID,
    socket,
    roomId,
  ]);

  return useMemo(
    () => ({
      isLoading,
      isConnected,
      error,
    }),
    [isLoading, isConnected, error]
  );
};

export default useCustomJoin;
