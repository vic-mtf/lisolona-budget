import React, { forwardRef } from 'react';
import Box from '@mui/material/Box';

import ParticipantsHeader from './header/ParticipantsHeader';
import ParticipantsContent from './content/ParticipantsContent';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import deepMerge from '../../../../../utils/mergeDeep';
import { useState } from 'react';
import { useCallback } from 'react';
import { filterByName } from '../../../../../utils/filterByKey';

const Participants = forwardRef((_, ref) => {
  const [category, setCategory] = useState(null);
  const bulkParticipants = useSelector(
    (store) => store.conference.meeting.participants
  );
  const bulkGuests = useSelector((store) => store.conference.meeting.guests);
  const id = useSelector((store) => store.user.id);

  // transform guest format
  const guests = useMemo(() => {
    const data = [];
    Object.values(bulkGuests)?.forEach((identity) => {
      data.push({
        state: {
          isWaiting: true,
          isGuest: true,
        },
        identity,
      });
    });
    return data;
  }, [bulkGuests]);

  // const isOrganizer = useSelector(
  //   (store) => store.conference.meeting.participants[id].state.isOrganizer
  // );
  const handRaised = useSelector(
    (store) => store.conference.meeting.actions.raiseHand
  );
  const search = useSelector(
    (store) => store.conference.meeting.actions.search
  );
  const isMicActive = useSelector(
    (store) => store.conference.setup.devices.microphone.enabled
  );
  const localState = useMemo(
    () => ({ isMicActive, handRaised }),
    [isMicActive, handRaised]
  );
  const getOnlyCat = useCallback(
    (p) => {
      if (category === 'inRoom') return Boolean(p?.state?.isInRoom);
      if (category === 'raiseHand') return Boolean(p?.state?.handRaised);
      if (category === 'waiting') return Boolean(p?.state?.isWaiting);
      else return true;
    },
    [category]
  );
  const users = useMemo(
    () =>
      [...Object.values({ ...bulkParticipants }), ...guests].map((d) => {
        const type = d.identity.id === id ? 'local' : 'remote';
        return {
          ...d,
          type,
          ...(type === 'local' && {
            state: deepMerge(d.state, localState),
          }),
        };
      }),
    [bulkParticipants, id, localState, guests]
  );

  const handRaisedCount = useMemo(() => {
    let count = 0;
    for (let p of users) if (p?.state?.isInRoom && p.state.handRaised) count++;
    return count;
  }, [users]);

  const waitingCount = useMemo(() => {
    let count = 0;
    for (let p of users) if (p?.state?.isWaiting) count++;
    return count;
  }, [users]);

  const getActiveUser = useCallback(
    ({ state }) => state?.isInRoom || state?.isWaiting,
    []
  );

  const participants = useMemo(
    () =>
      users
        .filter(getActiveUser)
        .filter(getOnlyCat)
        .filter(({ identity }) => filterByName(identity, search)),
    [getOnlyCat, search, users, getActiveUser]
  );

  return (
    <Box ref={ref} display="flex" flex={1}>
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        flexDirection="column"
      >
        <ParticipantsHeader
          category={category}
          setCategory={setCategory}
          handRaisedCount={handRaisedCount}
          waitingCount={waitingCount}
        />
        <ParticipantsContent participants={participants} category={category} />
      </Box>
    </Box>
  );
});

Participants.displayName = 'Participants';

export default React.memo(Participants);
