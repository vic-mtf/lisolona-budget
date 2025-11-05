import useSocket from '../useSocket';
import React, { useEffect } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';
import ringtones from '../../utils/ringtones';
import store from '../../redux/store';
import { useSelector } from 'react-redux';

const useUpdateOrganizerAuth = () => {
  const socket = useSocket();
  const notifications = useNotifications();
  const isMeeting = useSelector((store) => store.conference.step === 'meeting');
  const loading = useSelector((store) => store.conference.loading);
  const noticeTimerRef = React.useRef(null);

  useEffect(() => {
    const handleUpdateOrganizerAuth = (data) => {
      store.dispatch({
        type: 'conference/updateConferenceData',
        payload: {
          data: {
            meeting: { organizerAuth: data },
          },
        },
      });

      const storeState = store.getState();
      const participants = storeState.conference.meeting.participants;
      const userId = storeState.user.id;
      const p = participants[userId];
      const keys = Object.keys(data);
      const orgKey = 'controlAuthorization';
      const isOrgCommandAuth = keys.length === 1 ? orgKey in data : false;
      if (p?.state.isOrganizer || isOrgCommandAuth) return;
      ringtones.signalUnknown.volume = 0.1;
      ringtones.signalUnknown.play();
      keys.forEach((key) => {
        const value = data[key];
        const message = moderatorMessages[key][value];
        if (!message) return;
        if (['activateCam', 'activateMic'].includes(key)) {
          notifications.close('isCamActive');
          notifications.close('isMicActive');
          notifications.close('cam-mic');
        }
        notifications.close(`${userId}-organizer-${key}`);
        notifications.show(message, {
          key: `${userId}-organizer-${key}`,
        });
      });
    };
    socket?.on('update-auth-room', handleUpdateOrganizerAuth);
    return () => {
      socket?.off('update-auth-room', handleUpdateOrganizerAuth);
    };
  }, [socket, notifications]);

  useEffect(() => {
    if (!isMeeting || !loading) return;
    const checkCamOrMicAuth = () => {
      const storeState = store.getState();
      const userId = storeState.user.id;
      const p = storeState.conference.meeting.participants[userId];
      const { activateCam, activateMic } = p?.auth || {};
      if (!activateCam || !activateMic) {
        const key = `${userId}-organizer-`;
        notifications.close(key + 'activateCam');
        notifications.close(key + 'activateCam');
        notifications.close('isCamActive');
        notifications.close('isMicActive');
        const isCameAndMic = !activateCam && !activateMic;
        let message;
        if (isCameAndMic) message = moderatorMessages.activeCamAndMic[false];
        else if (!activateCam) message = moderatorMessages.activateCam[false];
        else message = moderatorMessages.activateMic[false];
        clearTimeout(noticeTimerRef.current);
        noticeTimerRef.current = setTimeout(() => {
          notifications.show(message, { key: 'cam-mic' });
          ringtones.signalUnknown.volume = 0.1;
          ringtones.signalUnknown.play();
        }, 1000);
      }
    };
    checkCamOrMicAuth();
  }, [isMeeting, loading, notifications]);
};

// const moderatorPermissions = {
//   activateCam: false,
//   activateMic: true,
//   allowPrivateMessage: false,
//   react: true,
//   shareScreen: true,
//   writeMessage: true,
// };

const moderatorMessages = {
  activeCamAndMic: {
    true: 'Le modérateur vous autorise à activer votre caméra et votre micro.',
    false: "Le modérateur a bloqué l'accès à la caméra et du micro.",
  },
  activateCam: {
    true: 'Le modérateur vous autorise à activer votre caméra.',
    false: "Le modérateur a bloqué  l'activation de la caméra.",
  },
  activateMic: {
    true: 'Le modérateur vous autorise à utiliser votre micro.',
    false: "Le modérateur a bloqué l'activation du micro.",
  },
  allowPrivateMessage: {
    true: 'Le modérateur autorise les messages privés entre participants.',
    false: 'Le modérateur a désactivé les messages privés.',
  },
  react: {
    true: "Le modérateur vous permet d'utiliser des réactions.",
    false: 'Le modérateur a désactivé les réactions.',
  },
  shareScreen: {
    true: 'Le modérateur vous autorise à partager votre écran.',
    false: "Le modérateur a bloqué le partage d'écran.",
  },
  writeMessage: {
    true: 'Le modérateur vous autorise à écrire dans le chat.',
    false: "Le modérateur a désactivé l'envoi de messages.",
  },
};

export default useUpdateOrganizerAuth;
