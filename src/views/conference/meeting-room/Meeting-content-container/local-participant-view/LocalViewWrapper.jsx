import React, { useState, useCallback } from "react";
import DragDropContainer from "../../../../../components/DragDropContainer";
import LocalParticipantView from "./LocalParticipantView";
import Typography from "@mui/material/Typography";
import ParticipantItemMicButton from "../../nav/participants/content/ParticipantItemMicButton";
import IconButton from "@mui/material/IconButton";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import Tooltip from "@mui/material/Tooltip";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { useDispatch, useSelector } from "react-redux";
import { updateConferenceData } from "../../../../../redux/conference/conference";
import useSmallScreen from "../../../../../hooks/useSmallScreen";

const LocalViewWrapper = () => {
  const [showSmallView, setShowSmallView] = useState(false);
  const handleOnReduce = useCallback(() => setShowSmallView(true), []);

  return (
    <DragDropContainer
      showSmallView={showSmallView}
      onShowSmallViewChange={setShowSmallView}
      smallView={<ShortcutButtons />}>
      <LocalParticipantView onReduced={handleOnReduce} />
    </DragDropContainer>
  );
};

const ShortcutButtons = () => {
  const matches = useSmallScreen();
  return (
    <>
      {!matches && (
        <Typography flexGrow={1} ml={1}>
          Vous
        </Typography>
      )}
      <EditVideoStyleButton />
      <ToggleMicroButton />
      <ToggleCameButton />
    </>
  );
};

const ToggleMicroButton = () => {
  const isMicroActive = useSelector(
    (store) => store.conference.setup.devices.microphone.enabled
  );

  return <ParticipantItemMicButton type='local' isMicActive={isMicroActive} />;
};

const ToggleCameButton = () => {
  const isCamActive = useSelector(
    (store) => store.conference.setup.devices.camera.enabled
  );
  const permission = useSelector(
    (state) => state.conference.setup.devices.camera.permission
  );
  const dispatch = useDispatch();

  const notPermission = permission ? permission !== "granted" : true;
  return (
    <Tooltip
      title={
        notPermission
          ? "Permission non accordée"
          : isCamActive
          ? "Caméra activée"
          : "Caméra désactivée"
      }>
      <div>
        <IconButton
          onClick={() => {
            dispatch(
              updateConferenceData({
                data: {
                  setup: { devices: { camera: { enabled: !isCamActive } } },
                },
              })
            );
          }}
          size='small'
          disabled={!permission || permission !== "granted"}>
          {isCamActive ? (
            <VideocamOutlinedIcon fontSize='small' />
          ) : (
            <VideocamOffOutlinedIcon fontSize='small' />
          )}
        </IconButton>
      </div>
    </Tooltip>
  );
};

const EditVideoStyleButton = () => {
  return (
    <IconButton size='small'>
      <LayersOutlinedIcon fontSize='small' />
    </IconButton>
  );
};

export default React.memo(LocalViewWrapper);
