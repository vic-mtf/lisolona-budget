import { useEffect, useMemo } from 'react';
import useSocket from '../useSocket';
import store from '../../redux/store';
import { useLocation } from 'react-router-dom';
import { useNotifications } from '@toolpad/core/useNotifications';
import getFullName from '../../utils/getFullName';
import ringtones from '../../utils/ringtones';
import normalizeObjectKeys from '../../utils/normalizeObjectKeys';
import { useSelector } from 'react-redux';

const useRemoteUserLeave = () => {
  const socket = useSocket();
  const { state } = useLocation();
  const id = useMemo(() => state?.data?.id, [state?.data]);
  const userId = useSelector((store) => store.user.id);
  const notifications = useNotifications();
  const isInRoom = useSelector(
    (store) => store.conference.meeting.participants?.[userId]?.state?.isInRoom
  );

  useEffect(() => {
    const onRemoteUserLeave = (d) => {
      const data = normalizeObjectKeys(d);
      const userId = store.getState().user.id;
      const remoteUserId = data?.id;
      if (userId === remoteUserId) return;
      const participants = store.getState().conference.meeting.participants;
      const participant = participants[remoteUserId];

      if (participant) {
        const { identity } = participant || { identity: 'Une personne' };
        store.dispatch({
          type: 'conference/updateConferenceData',
          payload: {
            key: [`meeting.participants.${remoteUserId}.state.isInRoom`],
            data: [false],
          },
        });
        notifications.show(`${getFullName(identity)} a quitté la réunion`, {
          key: remoteUserId,
        });
        ringtones.disconnect.play();
        ringtones.disconnect.volume = 0.1;
      }
    };
    const onBeforeUnload = () => {
      const storeState = store.getState();
      const step = storeState.conference.step;
      if (step !== 'meeting' || !isInRoom) return;

      socket.emit('leave-room', { id });
      socket?.disconnect();
      if (step !== 'meeting')
        store.dispatch({
          type: 'conference/updateConferenceData',
          payload: {
            key: ['step'],
            data: ['end'],
          },
        });
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    socket?.on('leave-room', onRemoteUserLeave);
    return () => {
      socket?.off('leave-room', onRemoteUserLeave);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [socket, id, notifications, isInRoom]);
  return null;
};

export default useRemoteUserLeave;
