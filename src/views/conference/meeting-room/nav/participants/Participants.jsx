import React, { forwardRef } from "react";
import Box from "@mui/material/Box";

import ParticipantsHeader from "./header/ParticipantsHeader";
import ParticipantsContent from "./content/ParticipantsContent";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import deepMerge from "../../../../../utils/mergeDeep";
import { useState } from "react";
import { useCallback } from "react";
import { filterByName } from "../../../../../utils/filterByKey";

const Participants = forwardRef((_, ref) => {
  const [category, setCategory] = useState(null);
  const bulkParticipants = useSelector(
    (store) => store.conference.meeting.participants
  );
  const id = useSelector((store) => store.user.id);

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
  const getFilterCat = useCallback(
    (p) => {
      if (category === "inRoom") return Boolean(p?.state?.isInRoom);
      if (category === "raiseHand") return Boolean(p?.state?.handRaised);
      if (category === "waiting") return false;
      else return true;
    },
    [category]
  );
  const users = useMemo(
    () =>
      Object.values(bulkParticipants).map((d) => {
        const type = d.identity.id === id ? "local" : "remote";
        return {
          ...d,
          type,
          ...(type === "local" && {
            state: deepMerge(d.state, localState),
          }),
        };
      }),
    [bulkParticipants, id, localState]
  );

  const handRaisedCount = useMemo(() => {
    let count = 0;
    for (let p of users) if (p?.state?.isInRoom && p.state.handRaised) count++;

    return count;
  }, [users]);

  const participants = useMemo(
    () =>
      []
        .concat(
          users.filter(({ state }) => state?.isInRoom)
          //.filter(({ state }) => !state?.isWaiting)
        )
        .filter(getFilterCat)
        .filter(({ identity }) => filterByName(identity, search)),
    [getFilterCat, search, users]
  );

  return (
    <Box ref={ref} bgcolor='background.paper' display='flex' flex={1}>
      <Box
        position='absolute'
        top={0}
        left={0}
        right={0}
        bottom={0}
        display='flex'
        flexDirection='column'>
        <ParticipantsHeader
          category={category}
          setCategory={setCategory}
          handRaisedCount={handRaisedCount}
        />
        <ParticipantsContent participants={participants} category={category} />
      </Box>
    </Box>
  );
});

Participants.displayName = "Participants";

export default React.memo(Participants);
