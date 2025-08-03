import { Box, Chip, Toolbar } from "@mui/material";
import PropTypes from "prop-types";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import React, { useMemo } from "react";
import Typography from "../../../../../components/Typography";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Participant from "../participant/Participant";
import { useMeetingData } from "../../../../../utils/MeetingProvider";
import VideoTrackView from "../participant/VideoTrackView";
import { width } from "@mui/system";

const ParticipantsPresentation = React.memo(() => {
  const [, { settersRemoteVideoTracks }] = useMeetingData();
  const pinId = useSelector((store) => store.conference.pinId);

  const videoTrack = useMemo(
    () => settersRemoteVideoTracks.getTrackById(pinId)?.videoTrack || null,
    [settersRemoteVideoTracks, pinId]
  );
  return (
    <Box
      display='flex'
      flex={1}
      overflow='hidden'
      width='100%'
      p={1}
      flexDirection='column'
      gap={1}>
      <Toolbar
        variant='dense'
        sx={{
          bgcolor: "background.paper",
        }}>
        <Typography variant='h6'>Présentation</Typography>
      </Toolbar>
      <Box
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        component={motion.div}
        sx={{
          aspectRatio: 16 / 9,
          minHeight: 0,
          minWidth: 0,
          // maxHeight: "100%",
          maxWidth: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          m: "auto",
          borderRadius: 1,
          overflow: "hidden",
          position: "relative",
          border: (theme) => "1px solid " + theme.palette.divider,
        }}>
        {/* Participant */}
        {pinId ? (
          <VideoTrackView
            videoTrack={videoTrack}
            sx={{
              // width: "auto",
              // height: "auto",
              position: "absolute",
              // objectFit: "cover",
              aspectRatio: 16 / 9,
            }}
          />
        ) : (
          <Chip
            label='Aucune présentation en cours. Toute image partagée peut être présentée ici.'
            icon={<ErrorOutlineOutlinedIcon />}
            variant='outlined'
            sx={{ mx: 1 }}
          />
        )}
      </Box>
    </Box>
  );
});

ParticipantsPresentation.displayName = "ParticipantsPresentation";

ParticipantsPresentation.propTypes = {
  participants: PropTypes.arrayOf(PropTypes.object),
};

export default ParticipantsPresentation;
