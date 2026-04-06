import { useEffect } from 'react';
import { canvasStreamComposer } from '@/utils/CanvasStreamComposer';
import { useRef } from 'react';
import { useRTCScreenShareClient } from 'agora-rtc-react';
import store from '@/redux/store';
import { useNotifications } from '@toolpad/core/useNotifications';
import { useState } from 'react';
import AgoraRTC from 'agora-rtc-react';
import { useCallback } from 'react';

const usePublishLocalScreen = (isConnected) => {
  const [loading, setLoading] = useState(false);
  const localTracksRef = useRef(null);
  const publishedRef = useRef(false);
  const joinedRef = useRef(false);
  const notifications = useNotifications();
  const userScreenShareClient = useRTCScreenShareClient();

  const onPublishLocalScreen = useCallback(
    async ({ detail }) => {
      setLoading(true);
      if (publishedRef.current) {
        setLoading(false);
        return;
      }
      const storeState = store.getState();
      const userId = storeState.user.id;
      const conference = storeState.conference;
      const user = conference.meeting.participants[userId];

      const SCREEN_ID = user?.screenId;
      const { APP_ID, TOKEN, CHANNEL } = conference.AGORA_DATA;
      const mss =
        'Impossible de publier vote écran à vos correspondants. Réessayez de partager votre écran';

      if (!joinedRef.current) {
        try {
          await userScreenShareClient.join(APP_ID, CHANNEL, TOKEN, SCREEN_ID);
          joinedRef.current = true;
        } catch (e) {
          console.error(e);
          notifications.show(mss, { severity: 'error' });
          setLoading(false);
          return;
        }
      }
      const { stream } = detail;
      if (stream instanceof MediaStream) {
        localTracksRef.current = userScreenShareClient.localTracks;

        try {
          if (localTracksRef.current?.length) {
            await userScreenShareClient.unpublish(localTracksRef.current);
          } else {
            localTracksRef.current = [];
            const [videoTrack] = stream.getVideoTracks();
            const localVideoTrack = AgoraRTC.createCustomVideoTrack({
              mediaStreamTrack: videoTrack,
            });
            localTracksRef.current.push(localVideoTrack);
            await userScreenShareClient.publish(localTracksRef.current);
            publishedRef.current = true;
            localTracksRef.current = userScreenShareClient.localTracks;
          }
        } catch (e) {
          console.error(e);
          notifications.show(mss, { severity: 'error' });
        }
      }
      setLoading(false);
    },
    [notifications, userScreenShareClient]
  );

  const onStopPublishLocalScreen = useCallback(async () => {
    setLoading(true);
    if (localTracksRef.current?.length) {
      await userScreenShareClient.unpublish(localTracksRef.current);
      localTracksRef.current.forEach((track) => {
        track.stop();
        track.close();
      });
      await userScreenShareClient.leave();
      joinedRef.current = false;
      publishedRef.current = false;
      localTracksRef.current = null;
    }
    setLoading(false);
  }, [userScreenShareClient]);

  useEffect(() => {
    if (!isConnected || loading) return;

    canvasStreamComposer.addEventListener('start', onPublishLocalScreen);
    canvasStreamComposer.addEventListener('close', onStopPublishLocalScreen);
    return () => {
      canvasStreamComposer.removeEventListener('start', onPublishLocalScreen);
      canvasStreamComposer.removeEventListener(
        'close',
        onStopPublishLocalScreen
      );
    };
  }, [isConnected, loading, onPublishLocalScreen, onStopPublishLocalScreen]);
};

export default usePublishLocalScreen;
