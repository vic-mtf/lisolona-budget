import React from "react";
import Box from "@mui/material/Box";
import ListSubheader from "@mui/material/ListSubheader";
import ParticipantItem from "./ParticipantItem";
import PropTypes from "prop-types";
import VirtualList from "../../../../../../components/VirtualList";
import { useMemo } from "react";

const ParticipantsContent = ({ participants, category }) => {
  const texts = {
    waiting: "Aucun participant en attente",
    raiseHand: "Aucun participant ayant levé la main trouvé",
    inRoom: "Aucun participant trouvé",
  };
  const sortedParticipants = useMemo(
    () => groupParticipant(participants, category),
    [participants, category]
  );
  return (
    <Box display='flex' flex={1} flexDirection='column' overflow='hidden'>
      <VirtualList
        emptyMessage={texts[category] || texts.inRoom}
        data={sortedParticipants.map(
          ({ identity, state, type, isLabelType, id, label, cat = "" }) => (
            <React.Fragment key={`${identity?.id || id}${cat}`}>
              {isLabelType ? (
                <ListSubheader disableSticky>{label}</ListSubheader>
              ) : (
                <ParticipantItem
                  variant={state.isOrganizer ? "moderator" : "collaborator"}
                  identity={identity}
                  state={state}
                  type={type}
                />
              )}
            </React.Fragment>
          )
        )}
      />
    </Box>
  );
};

const groupParticipant = (participants, category) => {
  let users = [];
  const handRaised = [
    { isLabelType: true, label: "Mains levées", id: "raiseHand" },
  ];
  const waiting = [
    { isLabelType: true, label: "Les participants en attente", id: "waiting" },
  ];
  const inMeeting = [
    { isLabelType: true, label: "Les participants actifs", id: "inMeeting" },
  ];
  const isCat = (cat) => (category ? category === cat : true);
  for (let i = 0; i < participants.length; ++i) {
    const p = participants[i];
    const s = p?.state;
    const newP = (cat) => ({ ...p, cat });
    if (s?.hasJoined && isCat("waiting")) waiting.push(newP("waiting"));
    if (s.handRaised && isCat("raiseHand")) handRaised.push(newP("raiseHand"));
    if (s.isInRoom && isCat("inMeeting")) inMeeting.push(newP("inMeeting"));
  }
  if (handRaised.length > 1) users = users.concat(handRaised);
  if (waiting.length > 1) users = users.concat(waiting);
  if (inMeeting.length > 1) users = users.concat(inMeeting);
  return users;
};

ParticipantsContent.propTypes = {
  participants: PropTypes.array,
  category: PropTypes.string,
};
export default React.memo(ParticipantsContent); // ParticipantsContent;
