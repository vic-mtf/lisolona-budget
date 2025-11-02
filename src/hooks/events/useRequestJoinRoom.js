import React, { useEffect } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';
import NoticeSnack from '../../components/NoticeSnack';
import useSocket from '../useSocket';
import store from '../../redux/store';
import { createElement } from 'react';
import Button from '@mui/material/Button';
import normalizeObjectKeys from '../../utils/normalizeObjectKeys';
import getFullName from '../../utils/getFullName';
import ringtones from '../../utils/ringtones';

const useRequestJoinRoom = () => {
  const socket = useSocket();
  const notifications = useNotifications();

  useEffect(() => {
    const handleRequestJoinRoom = (d) => {
      const data = normalizeObjectKeys(d);
      const key = `${data.id}-request-join-room`;
      notifications.close(key);
      const storeState = store.getState();
      const guests = { ...storeState.conference.meeting.guests };
      const { roomId, ...user } = data;
      guests[data.id] = user;

      if (storeState.conference.roomId === roomId) {
        store.dispatch({
          type: 'conference/updateConferenceData',
          payload: {
            key: ['meeting.guests'],
            data: [guests],
          },
        });
      }

      const handleResponse = (status) => {
        notifications.close(key);
        const storeState = store.getState();
        const guests = { ...storeState.conference.meeting.guests };
        delete guests[user.id];
        store.dispatch({
          type: 'conference/updateConferenceData',
          payload: {
            key: ['meeting.guests'],
            data: [guests],
          },
        });
        socket.emit('response-join-room', { status, userId: user.id, roomId });
        console.log('status => ', status);
      };

      const buttons = [
        {
          id: 'accepted',
          label: 'Accepter',
        },
        {
          id: 'declined',
          label: 'Refuser',
        },
      ];

      ringtones.newsRoom.volume = 0.1;
      ringtones.newsRoom.play();

      notifications.show(
        React.createElement(NoticeSnack, {
          name: getFullName(user),
          id: user.id,
          src: user.image,
          inline: true,
          action: buttons.map(({ id, label }) =>
            createElement(
              Button,
              {
                color: 'inherit',
                key: id,
                size: 'small',
                onClick: () => handleResponse(id),
              },
              label
            )
          ),
          message: `souhaite rejoindre cette reunion`,
        }),
        {
          key,
        }
      );
    };

    const handleAbortJoinRoom = (d) => {
      const user = normalizeObjectKeys(d);
      const key = `${user.id}-request-join-room`;
      notifications.close(key);
      const storeState = store.getState();
      const guests = { ...storeState.conference.meeting.guests };
      delete guests[user.id];
      store.dispatch({
        type: 'conference/updateConferenceData',
        payload: {
          key: ['meeting.guests'],
          data: [guests],
        },
      });
    };
    socket?.on('abort-join-room', handleAbortJoinRoom);
    socket?.on('request-join-room', handleRequestJoinRoom);
    return () => {
      socket?.off('request-join-room', handleRequestJoinRoom);
      socket?.off('abort-join-room', handleAbortJoinRoom);
    };
  }, [socket, notifications]);
};

export default useRequestJoinRoom;
