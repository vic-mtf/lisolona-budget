//import { useJoin } from "agora-rtc-react";
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateConferenceData } from '../../../../redux/conference/conference';
import { useNotifications } from '@toolpad/core/useNotifications';
import ringtones from '../../../../utils/ringtones';
import ActionWrapper from './ActionWrapper';
import useSocket from '../../../../hooks/useSocket';
import { useParams } from 'react-router-dom';
import useCustomJoin from './hooks/useCustomJoin';
import useLocalStoreData from '../../../../hooks/useLocalStoreData';

const AgoraActionsWrapper = () => {
  const [, setData] = useLocalStoreData('conference.meeting');
  const { code } = useParams();
  const loading = useSelector((store) => store.conference.loading);
  const userId = useSelector((store) => store.user.id);
  const UID = useSelector(
    (store) => store.conference.meeting.participants[userId].uid
  );
  const SCREEN_ID = useSelector(
    (store) => store.conference.meeting.participants[userId].screenId
  );
  const isInRoom = useSelector(
    (store) => store.conference.meeting.participants[userId].state.isInRoom
  );
  const socket = useSocket();
  const dispatch = useDispatch();
  const notifications = useNotifications();
  const { TOKEN, APP_ID, CHANNEL } = useSelector(
    (store) => store.conference.AGORA_DATA
  );
  const ready = useSelector((store) => store.conference.step === 'meeting');

  const { isConnected, isLoading, error } = useCustomJoin(
    { APP_ID, CHANNEL, TOKEN, UID, SCREEN_ID },
    ready
  );
  useEffect(() => {
    if (isConnected && loading && !isLoading) {
      dispatch(
        updateConferenceData({
          key: ['loading'],
          data: [false],
        })
      );
      ringtones.enter.volume = 0.1;
      ringtones.enter.play();
      setData({ startedAt: Date.now() });
    }
  }, [isConnected, loading, dispatch, isLoading, notifications, setData]);

  useEffect(() => {
    if (!error) return;
    const key = ['step'];
    const data = ['setup'];
    if (isInRoom) {
      socket.emit('leave-room', { id: code });
      key.push(`meeting.participants.${userId}.state.isInRoom}`);
      data.push(false);
    }
    dispatch(updateConferenceData({ key, data }));
    setTimeout(() => {
      notifications.show('Impossible de rejoindre, la session a expiré', {
        severity: 'error',
        key: 'session-expired',
      });
      ringtones.error.volume = 0.1;
      ringtones.error.play();
      dispatch(
        updateConferenceData({
          key: ['loading'],
          data: [false],
        })
      );
    }, 1000);
  }, [notifications, error, dispatch, socket, isInRoom, code, userId]);

  return <ActionWrapper isConnected={isConnected} />;
};

export default React.memo(AgoraActionsWrapper);
