import React, { useEffect } from 'react';
import { CALL_CHANNEL } from '../../utils/broadcastChannel';
import NoticeSnack from '../../components/NoticeSnack';
import useSocket from '../useSocket';
import store from '../../redux/store';
import normalizeObjectKeys from '../../utils/normalizeObjectKeys';
import { useNotifications } from '@toolpad/core/useNotifications';
import { setStatus } from '../../views/main/navigation/calls/groupCall';
import getFullName from '../../utils/getFullName';
import formatDate, { calculateDuration } from '../../utils/formatDate';
import { Button } from '@mui/material';
import ringtones, { vibrates } from '../../utils/ringtones';

const useNewCall = () => {
  const socket = useSocket();
  const notifications = useNotifications();

  useEffect(() => {
    const onCallStateChanged = (e) => {
      if (e.origin === window.location.origin) {
        if (e.data?.type === 'create') {
          const newCall = { ...e.data?.call };
          if (typeof newCall?.location === 'string') {
            const discussions = store.getState().data.app.discussions;
            const discussion = discussions.find(
              (d) => d?.id === newCall?.location
            );
            if (discussion) {
              newCall.location = discussion;
              delete discussion?.messages;
            }
          }
          const calls = store.getState().data.app.calls;
          const find = calls.find((c) => c.id === newCall?.id);
          if (!find) {
            store.dispatch({
              type: 'data/updateData',
              payload: {
                key: ['app.calls'],
                data: [[newCall, ...calls]],
              },
            });
          }
        }
      }
    };
    const onNewCall = async (c) => {
      const storeState = store.getState();
      const user = storeState.user;
      if (c.createdBy === user.id) return;

      store.dispatch({
        type: 'data/updateArraysData',
        payload: {
          data: { calls: [c] },
          user,
        },
      });
      const call = normalizeObjectKeys(c);

      const status = setStatus(call?.status);
      if (status === 'scheduled') {
        store.dispatch({
          type: 'data/updateData',
          payload: {
            key: [`app.actions.calls.blink.${call?.id}`],
            data: [true],
          },
        });

        const room = call?.room;
        const org = call.participants.find(
          (p) => p.identity.id !== call.createdBy
        )?.identity;

        const orgName = getFullName(org);
        const dur = calculateDuration(call?.createdAt, call?.startedAt);
        const date = formatDate({ date: call?.startedAt }).toLocaleLowerCase();
        const message = `Une nouvelle réunion a été planifiée par ${orgName} pour ${date} durant ${dur}`;
        const key = 'create-new-call' + call?.id;
        notifications.show(
          React.createElement(NoticeSnack, {
            name: room?.name,
            src: room?.image,
            id: room?.id,
            words: [orgName],
            message,
            action: [
              React.createElement(
                Button,
                {
                  key: 'more-info',
                  color: 'inherit',
                  onClick() {
                    notifications.close(key);
                    const newCall = store
                      .getState()
                      .data.app.calls.find((c) => c.id === call?.id);
                    store.dispatch({
                      type: 'data/updateData',
                      payload: {
                        key: [
                          'app.actions.calls.info',
                          `app.actions.calls.blink.${call?.id}`,
                        ],
                        data: [
                          {
                            call: {
                              ...newCall,
                              calls: [],
                              status: setStatus(newCall?.status),
                            },
                            open: true,
                          },
                          true,
                        ],
                      },
                    });
                  },
                },
                'En savoir plus'
              ),
            ],
          }),
          {
            key,
          }
        );

        ringtones.alert.play();
        vibrates.alert();
      }
    };

    CALL_CHANNEL.addEventListener('message', onCallStateChanged);
    socket?.on('create-new-call', onNewCall);

    return () => {
      CALL_CHANNEL.removeEventListener('message', onCallStateChanged);
      socket?.off('create-new-call', onNewCall);
    };
  }, [socket, notifications]);
};

export default useNewCall;
