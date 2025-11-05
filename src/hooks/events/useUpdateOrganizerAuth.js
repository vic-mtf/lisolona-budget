import useSocket from '../useSocket';
import { useEffect } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';
import ringtones from '../../utils/ringtones';
import store from '../../redux/store';

const useUpdateOrganizerAuth = () => {
  const socket = useSocket();
  const notifications = useNotifications();

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
      const isCamActive = storeState.conference.setup.devices.camera.enabled;
      const isMicActive =
        storeState.conference.setup.devices.microphone.enabled;
      keys.forEach((key) => {
        const value = data[key];
        const message = moderatorMessages[key][value];
        if (!message) return;
        if (
          !value &&
          ['activateCam', 'activateMic'].includes(key) &&
          (isCamActive || isMicActive)
        )
          return;
        notifications.show(message, {
          key: `${userId}-organizer`,
        });
      });
    };
    socket?.on('update-auth-room', handleUpdateOrganizerAuth);
    return () => {
      socket?.off('update-auth-room', handleUpdateOrganizerAuth);
    };
  }, [socket, notifications]);
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
  activateCam: {
    true: 'Le modérateur vous autorise à activer votre caméra.',
    false: "Le modérateur a bloqué l'accès à la caméra.",
  },
  activateMic: {
    true: 'Le modérateur vous autorise à utiliser votre micro.',
    false: 'Le modérateur a désactivé votre micro.',
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
