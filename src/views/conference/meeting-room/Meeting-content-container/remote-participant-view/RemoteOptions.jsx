import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import RemoteMoreOptions from "./RemoteMoreOptions";
import Tooltip from "@mui/material/Tooltip";
import ZoomOutMapOutlinedIcon from "@mui/icons-material/ZoomOutMapOutlined";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import ZoomInMapOutlinedIcon from "@mui/icons-material/ZoomInMapOutlined";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updateConferenceData } from "../../../../../redux/conference/conference";
import useIsOrganizer from "../../../../../hooks/useIsOrganizer";
import getFullName from "../../../../../utils/getFullName";
import useSocket from "../../../../../hooks/useSocket";

const RemoteOptions = ({ id }) => {
  const containerRef = React.useRef();
  return (
    <>
      <Box
        ref={containerRef}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
          "& > .remote-user-options": {
            opacity: 0,
            pointerEvents: "none",
            touchAction: "none",
          },
          "&:hover > .remote-user-options": {
            pointerEvents: "auto",
            opacity: 0.4,
            "&:hover": {
              opacity: 1,
              touchAction: "auto",
            },
          },
        }}>
        <Box
          className='remote-user-options'
          component='div'
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          sx={{
            pointerEvents: "none",
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
            transform: "translate(-50%, -50%)",
            p: 0.5,
            borderRadius: 1,
            top: "50%",
            left: "50%",
            position: "absolute",
            color: "#fff",
            bgcolor: (t) => alpha(t.palette.common.black, 0.6),
            transition: (t) =>
              t.transitions.create("opacity", {
                easing: t.transitions.easing.easeInOut,
                duration: t.transitions.duration.leavingScreen,
              }),
            zIndex: (t) => t.zIndex.tooltip,
          }}>
          <MicroButton id={id} />
          <VideoButton id={id} />
          <EnlargeButton id={id} />
        </Box>
      </Box>
      <RemoteMoreOptions containerRef={containerRef} />
    </>
  );
};

const EnlargeButton = ({ id }) => {
  const fullScreen = useSelector(
    (state) => state.conference.meeting.actions.liveInteractionGrid.fullScreen
  );
  const dispatch = useDispatch();

  const handleToggleFullScreen = () => {
    dispatch(
      updateConferenceData({
        key: [
          "meeting.actions.liveInteractionGrid.fullScreen",
          "meeting.actions.liveInteractionGrid.activeId",
        ],
        data: [!fullScreen, id],
      })
    );
  };

  return (
    <div>
      <Tooltip title={fullScreen ? "Réduire" : "Agrandir"}>
        <IconButton size='small' onClick={handleToggleFullScreen}>
          {fullScreen ? (
            <ZoomInMapOutlinedIcon fontSize='small' />
          ) : (
            <ZoomOutMapOutlinedIcon fontSize='small' />
          )}
        </IconButton>
      </Tooltip>
    </div>
  );
};

const VideoButton = ({ id }) => {
  const dispatch = useDispatch();
  const isCamActive = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.state?.isCamActive
  );
  const show = useSelector(
    (store) =>
      store.conference.meeting.actions.liveInteractionGrid.participant.hide?.[
        id
      ] !== "video"
  );
  const identity = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.identity
  );
  const fn = useMemo(() => getFullName(identity)?.split(/\s/)[0], [identity]);

  const showMss = `${show ? "Cacher la  vidéo de " : "Afficher la video de "}${fn} pour vous`;
  const activeMss = isCamActive ? showMss : `Caméra de ${fn} désactivée`;

  const handleToggleCam = () => {
    dispatch(
      updateConferenceData({
        key: [`meeting.actions.liveInteractionGrid.participant.hide.${id}`],
        data: [show ? "video" : null],
      })
    );
  };

  return (
    <div>
      <Tooltip title={activeMss}>
        <div>
          <IconButton
            size='small'
            disabled={!isCamActive}
            onClick={handleToggleCam}>
            {isCamActive && show ? (
              <VideocamOutlinedIcon fontSize='small' />
            ) : (
              <VideocamOffOutlinedIcon fontSize='small' />
            )}
          </IconButton>
        </div>
      </Tooltip>
    </div>
  );
};

const MicroButton = ({ id }) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const isMicActive = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.state?.isMicActive
  );
  const identity = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.identity
  );
  const fn = useMemo(() => getFullName(identity)?.split(/\s/)[0], [identity]);
  const isOrganizer = useIsOrganizer();

  const title = isMicActive
    ? `${
        isOrganizer
          ? "Désactiver le micro de"
          : "Vous ne pouvez pas désactiver le micro de"
      } ${fn}`
    : `Micro de ${fn} désactivé`;

  const handleToggleMic = () => {
    dispatch(
      updateConferenceData({
        key: [`meeting.participants.${id}.state.isMicActive`],
        data: [false],
      })
    );
    socket?.emit("signal-room", { state: { isMicActive }, participants: [id] });
  };

  return (
    <div>
      <Tooltip title={title}>
        <div>
          <IconButton
            size='small'
            disabled={!isMicActive || !isOrganizer}
            onClick={handleToggleMic}>
            {isMicActive ? (
              <KeyboardVoiceOutlinedIcon fontSize='small' />
            ) : (
              <MicOffOutlinedIcon fontSize='small' />
            )}
          </IconButton>
        </div>
      </Tooltip>
    </div>
  );
};

RemoteOptions.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
EnlargeButton.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
VideoButton.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
MicroButton.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default React.memo(RemoteOptions); // RemoteOptions;
