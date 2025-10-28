import React, { useEffect } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';
import NoticeSnack from '../../components/NoticeSnack';
import useSocket from '../useSocket';
import store from '../../redux/store';
import { createElement } from 'react';
import Button from '@mui/material/Button';

const useRequestJoinRoom = () => {
  const socket = useSocket();
  const notifications = useNotifications();

  useEffect(() => {
    const handleRequestJoinRoom = ({ name, roomId, userId, src }) => {
      const key = `${userId}-request-join-room`;
      notifications.close(key);
      const storeState = store.getState();
      const guests = { ...storeState.conference.meeting.guests };

      guests[userId] = { name, id: userId };

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
        delete guests[userId];
        store.dispatch({
          type: 'conference/updateConferenceData',
          payload: {
            key: ['meeting.guests'],
            data: [guests],
          },
        });
        socket.emit('response-join-room', { status, userId, roomId });
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

      notifications.show(
        React.createElement(NoticeSnack, {
          name: name,
          id: userId,
          src,
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
    const handleAbortJoinRoom = ({ userId }) => {
      const key = `${userId}-request-join-room`;
      notifications.close(key);
      const storeState = store.getState();
      const guests = { ...storeState.conference.meeting.guests };
      delete guests[userId];
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
