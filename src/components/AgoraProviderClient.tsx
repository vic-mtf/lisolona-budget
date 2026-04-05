import AgoraRTC, {
  AgoraRTCProvider,
  AgoraRTCScreenShareProvider,
} from 'agora-rtc-react';
import { useMemo, useEffect, useState } from 'react';
import { RemoteUsersTrackContext } from '../views/conference/meeting-room/agora-actions-wrapper/hooks/useRemoteUsersTrack';
import { useRTCClient } from 'agora-rtc-react';
import store from '../redux/store';

AgoraRTC.setLogLevel(4);

export default function AgoraProviderClient({ children }) {
  const [RTCScreenShareClient, setRTCScreenShareClient] = useState(
    AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
  );
  const RTCClient = useMemo(
    () => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }),
    []
  );

  useEffect(() => {
    AgoraRTC.setLogLevel(4);
    RTCClient.enableAudioVolumeIndicator();
    const newRTCScreenShareClient = ({ detail }) => {
      const { client } = detail;
      setRTCScreenShareClient(client);
    };
    const name = '__newRTCScreenShareClient';
    window.addEventListener(name, newRTCScreenShareClient);
    return () => {
      window.removeEventListener(name, newRTCScreenShareClient);
    };
  }, [RTCClient]);

  return (
    <AgoraRTCProvider client={RTCClient}>
      <AgoraRTCScreenShareProvider client={RTCScreenShareClient}>
        {children}
      </AgoraRTCScreenShareProvider>
    </AgoraRTCProvider>
  );
}

export const RemoteUsersTrackProvider = ({ children }) => {
  const [remoteUsersTrack, setRemoteUsersTrack] = useState([]);
  const client = useRTCClient();

  useEffect(() => {
    const onUserPublished = async (user, mediaType) => {
      const storeState = store.getState();
      const userId = storeState.user.id;
      const participants = storeState.conference.meeting.participants;
      const screenId = participants?.[userId]?.screenId;
      if (screenId === user.uid) return; // your screen
      await client.subscribe(user, mediaType);

      if (mediaType === 'audio') user.audioTrack.play();
      const key = mediaType + 'Track';
      setRemoteUsersTrack((remoteUsersTrack) => {
        const index = remoteUsersTrack.findIndex((t) => t.uid === user.uid);
        if (~index) {
          const users = [...remoteUsersTrack];
          users[index] = {
            ...users[index],
            [key]: user[key],
          };
          return users;
        }
        return [...remoteUsersTrack, { uid: user.uid, [key]: user[key] }];
      });
    };

    const onUserUnpublished = (user, mediaType) => {
      setRemoteUsersTrack((remoteUsersTrack) => {
        const index = remoteUsersTrack.findIndex((t) => t.uid === user.uid);
        if (~index) {
          const users = [...remoteUsersTrack];
          const mainKey = mediaType + 'Track';
          const secondaryKey = `${
            mediaType === 'audio' ? 'video' : 'audio'
          }Track`;
          users[index][mainKey] = null;
          if (!users[index][secondaryKey])
            return users.filter((t) => t.uid !== user.uid);
          return users;
        }
        return remoteUsersTrack;
      });
    };
    client.on('user-published', onUserPublished);
    client.on('user-unpublished', onUserUnpublished);
    return () => {
      client.off('user-published', onUserPublished);
      client.off('user-unpublished', onUserUnpublished);
    };
  }, [client]);

  return (
    <RemoteUsersTrackContext.Provider value={remoteUsersTrack}>
      {children}
    </RemoteUsersTrackContext.Provider>
  );
};