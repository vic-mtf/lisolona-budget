import React from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import Paper from "@mui/material/Paper";
import RemoteParticipantView from "../remote-participant-view/RemoteParticipantView";
import { useEffect } from "react";
import store from "../../../../../redux/store";
const MotionPaper = motion.create(Paper);

const SpeakerView = () => {
  const activeId = useSelector(
    (state) => state.conference.meeting.actions.liveInteractionGrid.activeId
  );
  const isInRoom = useSelector(
    (store) =>
      store.conference.meeting.participants?.[activeId]?.state?.isInRoom
  );
  const fullscreen = useSelector(
    (state) => state.conference.meeting.actions.liveInteractionGrid.fullScreen
  );

  useEffect(() => {
    if (isInRoom) return;
    const storeState = store.getState();
    const participants = storeState.conference.meeting.participants;
    const id = storeState.user.id;
    const p = Object.values(participants).find(
      (p) => p.state?.isInRoom && id !== p?.identity?.id
    );

    if (fullscreen)
      store.dispatch({
        type: "conference/updateConferenceData",
        payload: {
          data: {
            meeting: {
              actions: {
                liveInteractionGrid: {
                  fullScreen: Boolean(p),
                  ...(p && { activeId: p?.identity?.id }),
                },
              },
            },
          },
        },
      });
  }, [isInRoom, fullscreen]);

  return (
    <AnimatePresence>
      {fullscreen && (
        <Box
          component={motion.div}
          key={activeId}
          position='absolute'
          bgcolor='black'
          top={0}
          left={0}
          right={0}
          bottom={0}
          display='flex'
          justifyContent='center'
          alignItems='center'
          zIndex={(t) => t.zIndex.tooltip + 100}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <MotionPaper
            layout
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              bgcolor: "background.paper",
              cursor: "pointer",
            }}
            transition={{
              layout: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] },
            }}>
            <RemoteParticipantView id={activeId} />
          </MotionPaper>
        </Box>
      )}
    </AnimatePresence>
  );
};

SpeakerView.propTypes = {
  children: PropTypes.node,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default React.memo(SpeakerView);
