import React, { useEffect } from 'react';
import { useNotifications } from '@toolpad/core/useNotifications';
import NoticeSnack from '@/components/NoticeSnack';
import useSocket from '../useSocket';
import store from '@/redux/store';
import { createElement } from 'react';
import Button from '@mui/material/Button';
import normalizeObjectKeys from '@/utils/normalizeObjectKeys';
import getFullName, { genNameSummary } from '@/utils/getFullName';
import ringtones from '@/utils/ringtones';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const key = 'new-request-join-room';

const useRequestJoinRoom = () => {
  const isMeeting = useSelector((store) => store.conference.step === 'meeting');
  const loading = useSelector((store) => store.conference.loading);
  const socket = useSocket();
  const notifications = useNotifications();
  const showNoticeRef = React.useRef(false);
  const checkedGuestRef = React.useRef(true);
  const timerRef = React.useRef(null);

  const handleResponse = useCallback(
    (status) => {
      const storeState = store.getState();
      notifications.close(key);
      const bulkGuests = storeState.conference.meeting.guests;
      const roomId = storeState.conference.roomId;
      store.dispatch({
        type: 'conference/updateConferenceData',
        payload: {
          key: ['meeting.guests'],
          data: [{}],
        },
      });
      Object.values(bulkGuests).forEach(({ id: userId }) => {
        socket.emit('response-join-room', { status, userId, roomId });
      });
    },
    [notifications, socket]
  );

  const noticesNewGuests = useCallback(
    (newGuest) => {
      notifications.close(key);
      const bulkGuests = {
        ...store.getState().conference.meeting.guests,
        ...(newGuest && { [newGuest.id]: newGuest }),
      };
      if (Object.values(bulkGuests).length === 0) return;
      const guests = Object.values(bulkGuests);
      const fullNames = guests.map((g) => getFullName(g)?.trim());
      const names = genNameSummary(fullNames);
      const words = fullNames.map((n) => n?.split(/\s+/)).flat();
      const isMany = guests.length > 1;
      const message = `${
        isMany ? names + ' souhaitent rejoindre' : 'souhaite rejoindre'
      } cette reunion`;

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
          participants: guests,
          inline: true,
          showNoticeRef,
          words,
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
          message,
        }),
        {
          key,
        }
      );
      return bulkGuests;
    },
    [handleResponse, notifications]
  );

  useEffect(() => {
    const handleRequestJoinRoom = (d) => {
      const data = normalizeObjectKeys(d);
      notifications.close(key);
      const storeState = store.getState();
      const guests = { ...storeState.conference.meeting.guests };
      const { roomId, ...user } = data;

      if (storeState.conference.roomId === roomId) {
        noticesNewGuests(user);
        guests[user.id] = user;
        ringtones.newsRoom.volume = 0.1;
        ringtones.newsRoom.play();
        store.dispatch({
          type: 'conference/updateConferenceData',
          payload: {
            key: ['meeting.guests'],
            data: [guests],
          },
        });
      }
    };

    const handleAbortJoinRoom = (d) => {
      const user = normalizeObjectKeys(d);
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
      if (Object.values(guests).length === 0) notifications.close(key);
      else {
        if (showNoticeRef.current) noticesNewGuests();
      }
    };

    socket?.on('abort-join-room', handleAbortJoinRoom);
    socket?.on('request-join-room', handleRequestJoinRoom);
    return () => {
      socket?.off('request-join-room', handleRequestJoinRoom);
      socket?.off('abort-join-room', handleAbortJoinRoom);
    };
  }, [socket, notifications, noticesNewGuests]);

  useEffect(() => {
    if (isMeeting && checkedGuestRef.current && !loading) {
      checkedGuestRef.current = false;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        clearTimeout(timerRef.current);
        if (noticesNewGuests()) {
          ringtones.newsRoom.volume = 0.1;
          ringtones.newsRoom.play();
        }
      }, 1000);
    }
    if (!isMeeting && !checkedGuestRef.current) {
      checkedGuestRef.current = true;
    }
  }, [isMeeting, noticesNewGuests, loading]);
};

export default useRequestJoinRoom;
