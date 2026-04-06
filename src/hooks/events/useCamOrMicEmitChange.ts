import { useSelector } from 'react-redux';
import useSocket from '../useSocket';
import { useEffect } from 'react';
import { isPlainObject } from 'lodash';
import { useNotifications } from '@toolpad/core/useNotifications';
import store from '@/redux/store';

const useCamOrMicEmitChange = () => {
  const notifications = useNotifications();
  const isCamActive = useSelector(
    (store) => store.conference.setup.devices.camera.enabled
  );
  const isMicActive = useSelector(
    (store) => store.conference.setup.devices.microphone.enabled
  );
  const socket = useSocket();

  useEffect(() => {
    socket?.emit('signal-room', { state: { isCamActive } });
  }, [socket, isCamActive]);

  useEffect(() => {
    socket?.emit('signal-room', { state: { isMicActive } });
  }, [socket, isMicActive]);

  useEffect(() => {
    const onSignal = ({ state, participants = [], author }) => {
      if (!isPlainObject(state) || !Array.isArray(participants) || !author)
        return;
      const storeState = store.getState();
      const id = storeState.user.id;
      const isLocalUser = participants.includes(id);
      const key = ['isCamActive', 'isMicActive'].find((k) => hasProp(state, k));
      if (isLocalUser && key && author) {
        const localDevice =
          storeState.conference.setup.devices[
            key === 'isCamActive' ? 'camera' : 'microphone'
          ];
        if (localDevice.enabled === state[key]) return;

        notifications.close(key);
        const message = `Le modérateur a désactivé votre ${
          key === 'isCamActive' ? 'caméra' : 'micro'
        }`;
        notifications.show(message, { key });
        const device = key === 'isCamActive' ? 'camera' : 'microphone';
        store.dispatch({
          type: 'conference/updateConferenceData',
          payload: {
            data: {
              meeting: { participants: { [id]: { state: { [key]: false } } } },
              setup: { devices: { [device]: { enabled: false } } },
            },
          },
        });
      }
    };
    socket?.on('signal-room', onSignal);
    return () => {
      socket?.off('signal-room', onSignal);
    };
  }, [socket, notifications]);
};

const hasProp = (obj, prop) => isPlainObject(obj) && prop in obj;

export default useCamOrMicEmitChange;
