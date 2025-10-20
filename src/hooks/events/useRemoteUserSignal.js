import { useEffect } from 'react';
import useSocket from '../useSocket';
import store from '../../redux/store';
import { isPlainObject } from '@reduxjs/toolkit';
import getFullName from '../../utils/getFullName';
import { useNotifications } from '@toolpad/core/useNotifications';
import ringtones from '../../utils/ringtones';

const useRemoteUserSignal = () => {
  const socket = useSocket();

  //update state or auth on store
  useEffect(() => {
    const handleSignal = ({ participants = [], state, auth }) => {
      const members = store.getState().conference.meeting.participants;
      const data = {};
      for (let p of participants) {
        let update = false;
        const participant = Object.assign({}, members[p] || {});
        if (Object.keys(participant).length) {
          if (state) {
            participant.state = state;
            update = true;
          }
          if (auth) {
            participants.auth = auth;
            update = true;
          }
        }
        if (update) data[p] = { ...participant };
      }

      if (Object.keys(data).length)
        store.dispatch({
          type: 'conference/updateConferenceData',
          payload: {
            data: { meeting: { participants: data } },
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
      const names = [];
      const userId = store.getState().user.id;

      for (let p of participants) {
        const participant = members[p];
        if (participant && participant?.identity?.id !== userId) {
          names.push(getFullName(participant.identity));
          const prop = 'handRaised';
          const key = names.join('') + prop;
          if (hasProp(state, prop) && !state.handRaised) {
            notifications.close(key);
            ringtones.lower.volume = 0.03;
            ringtones.lower.play();
          }
          if (hasProp(state, prop) && state?.handRaised) {
            const message =
              names > 1 ? 'ont  levé leurs mains' : 'a levé sa main';
            notifications.show(`${genNameSummary(names)} ${message}`, { key });
            ringtones.raise.volume = 0.05;
            ringtones.raise.play();
          }
        }
      }
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
        `${fn} ${
          isOrg
            ? 'vous a ajouté en tant que modérateur'
            : 'vous a retiré en tant que modérateur'
        } `,
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
const fname = (fullName) => fullName.trim().split(/\s+/)[0];
const genNameSummary = (fullNames) => {
  const count = fullNames.length;
  const ft = fname(fullNames[0]);
  const lt = fname(fullNames[fullNames.length - 1]);
  if (!count) return '';
  if (count === 1) return fullNames[0];
  if (count === 2) return `${ft} et ${lt}`;
  if (count === 3) return `${ft}, ${lt} et 1 autre personne`;
  return `${ft}, ${lt} et ${count - 2} autres personnes`;
};

export default useRemoteUserSignal;
