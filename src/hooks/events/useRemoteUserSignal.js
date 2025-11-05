import React, { useEffect } from 'react';
import useSocket from '../useSocket';
import store from '../../redux/store';
import { isPlainObject } from '@reduxjs/toolkit';
import getFullName, { fname, genNameSummary } from '../../utils/getFullName';
import { useNotifications } from '@toolpad/core/useNotifications';
import ringtones from '../../utils/ringtones';
import NoticeSnack from '../../components/NoticeSnack';
import WavingHand from '../../components/WavingHand';
import HighlightWord from '../../components/HighlightWord';

const useRemoteUserSignal = () => {
  const socket = useSocket();

  useEffect(() => {
    const handleSignal = ({ participants: members = [], state, auth }) => {
      const data = store.getState().conference.meeting.participants;
      const participants = JSON.parse(JSON.stringify(data));
      let update = false;
      for (const id of members) {
        if (participants[id]) {
          if (state) {
            participants[id].state = { ...participants[id].state, ...state };
            update = true;
          }
          if (auth) {
            participants[id].auth = { ...participants[id].auth, ...auth };
            update = true;
          }
        }
      }

      if (update)
        store.dispatch({
          type: 'conference/updateConferenceData',
          payload: {
            data: { meeting: { participants } },
          },
        });
    };
    socket?.on('signal-room', handleSignal);
    return () => {
      socket?.off('signal-room', handleSignal);
    };
  }, [socket]);

  // raise hand signal
  useRaiseHandSignal();
  // organizer signal
  useOrganizerSignal();
};

const useRaiseHandSignal = () => {
  const socket = useSocket();
  const notifications = useNotifications();

  useEffect(() => {
    const onSignal = ({ state, participants = [] }) => {
      const members = store.getState().conference.meeting.participants;
      const userId = store.getState().user.id;
      let isNewRaise = false;
      const users = Object.keys(members)
        .filter((id) => id !== userId)
        .filter((id) => !participants.includes(id))
        .filter((id) => members[id].state.isInRoom)
        .filter((id) => members[id].state.handRaised)
        .map((id) => members[id].identity);

      const key = 'handRaised';
      for (let p of participants) {
        const participant = members[p];
        if (participant && participant?.identity?.id !== userId) {
          if (hasProp(state, key) && !state.handRaised) {
            notifications.close(key);
            ringtones.lower.volume = 0.03;
            ringtones.lower.play();
          }
          if (hasProp(state, key) && state?.handRaised) {
            users.push(participant?.identity);
            isNewRaise = true;
            ringtones.raise.volume = 0.05;
            ringtones.raise.play();
          }
        }
      }
      if (!isNewRaise) return;
      const fullNames = users.map((u) => getFullName(u)?.trim());
      const words = fullNames.map((n) => n?.trim()?.split(/\s+/)).flat();
      const names = genNameSummary(fullNames);
      const isMany = fullNames.length > 1;

      const message = `${isMany ? names : ''} ${
        isMany ? 'ont levé leurs mains' : 'a levé la main'
      }`.trim();

      notifications.show(
        React.createElement(NoticeSnack, {
          participants: users,
          inline: true,
          inlineAction: true,
          message,
          action: React.createElement(WavingHand),
          words,
        }),
        { key }
      );
    };

    socket?.on('signal-room', onSignal);
    return () => {
      socket?.off('signal-room', onSignal);
    };
  }, [socket, notifications]);
};

const useOrganizerSignal = () => {
  const socket = useSocket();
  const notifications = useNotifications();

  useEffect(() => {
    const onSignal = ({ state, participants = [], author }) => {
      const storeState = store.getState();
      const userId = storeState.user.id;
      const notMine = !participants.some((p) => p === userId);
      const isOrg = state?.isOrganizer;

      if (!hasProp(state, 'isOrganizer')) return;
      if (!author || userId === author || notMine) return;
      const participant =
        storeState.conference.meeting.participants[author]?.identity;
      const fullName = getFullName(participant);
      const fn = fname(fullName);

      const key = `${userId}-organizer`;
      notifications.close(key);
      notifications.show(
        React.createElement(HighlightWord, {
          text: `${fn} ${
            isOrg
              ? 'vous a ajouté en tant que modérateur'
              : 'vous a retiré en tant que modérateur'
          } `,
          words: [fn],
        }),

        { key }
      );
      ringtones.signalUnknown.volume = 0.1;
      ringtones.signalUnknown.play();
      if (!isOrg && storeState.conference.meeting.nav.id === 'authParams') {
        store.dispatch({
          type: 'conference/updateConferenceData',
          payload: {
            key: ['meeting.nav.open'],
            data: [false],
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

export default useRemoteUserSignal;
