import React from "react";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import CoPresentOutlinedIcon from "@mui/icons-material/CoPresentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
// import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PinInvokeOutlinedIcon from "@mui/icons-material/PinInvokeOutlined";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updateConferenceData } from "../../../../../../redux/conference/conference";

const LocalOptions = ({ onClose }) => {
  return (
    <>
      <CamOption onClose={onClose} />
      <MicOption onClose={onClose} />
      <MirrorCamOption onClose={onClose} />
      <SettingOption onClose={onClose} />
    </>
  );
};

LocalOptions.propTypes = { onClose: PropTypes.func };

const CamOption = ({ onClose }) => {
  const isCamActive = useSelector(
    (store) => store.conference.setup.devices.camera.enabled
  );
  const dispatch = useDispatch();
  const onToggleCam = () => {
    console.log(isCamActive);
    dispatch(
      updateConferenceData({
        key: ["setup.devices.camera.enabled"],
        data: [!isCamActive],
      })
    );
    if (typeof onClose === "function") onClose();
  };
  return (
    <MenuItem onClick={onToggleCam}>
      <ListItemIcon>
        {isCamActive ? (
          <VideocamOutlinedIcon fontSize='small' />
        ) : (
          <VideocamOffOutlinedIcon fontSize='small' />
        )}
      </ListItemIcon>
      <ListItemText
        primary={isCamActive ? "Désactiver la caméra" : "Activer la caméra"}
        slotProps={{ primary: { variant: "body2" } }}
      />
    </MenuItem>
  );
};
CamOption.propTypes = { onClose: PropTypes.func };

const MicOption = ({ onClose }) => {
  const isMicActive = useSelector(
    (store) => store.conference.setup.devices.microphone.enabled
  );
  const dispatch = useDispatch();
  const onToggleMic = () => {
    dispatch(
      updateConferenceData({
        key: ["setup.devices.microphone.enabled"],
        data: [!isMicActive],
      })
    );
    if (typeof onClose === "function") onClose();
  };
  return (
    <MenuItem onClick={onToggleMic}>
      <ListItemIcon>
        {isMicActive ? (
          <MicNoneOutlinedIcon fontSize='small' />
        ) : (
          <MicOffOutlinedIcon fontSize='small' />
        )}
      </ListItemIcon>
      <ListItemText
        primary={isMicActive ? "Désactiver le micro" : "Activer le micro"}
        slotProps={{ primary: { variant: "body2" } }}
      />
    </MenuItem>
  );
};
MicOption.propTypes = { onClose: PropTypes.func };

const MirrorCamOption = ({ onClose }) => {
  const mode = useSelector(
    (store) => store.conference.meeting.view.localParticipant.mode
  );
  console.log(mode);
  const dispatch = useDispatch();
  const onToggleView = () => {
    dispatch(
      updateConferenceData({
        key: ["meeting.view.localParticipant.mode"],
        data: [mode === "floating" ? "grid" : "floating"],
      })
    );
    if (typeof onClose === "function") onClose();
  };
  return (
    <MenuItem onClick={onToggleView}>
      <ListItemIcon>
        {mode === "floating" ? (
          <CoPresentOutlinedIcon fontSize='small' />
        ) : (
          <PinInvokeOutlinedIcon fontSize='small' />
        )}
      </ListItemIcon>
      <ListItemText
        slotProps={{ primary: { variant: "body2" } }}
        primary={
          mode === "floating"
            ? "Ajouter dans la grille"
            : "Retirer de la grille"
        }
      />
    </MenuItem>
  );
};

MirrorCamOption.propTypes = { onClose: PropTypes.func };

const SettingOption = ({ onClose }) => {
  return (
    <MenuItem onClick={onClose} disabled>
      <ListItemIcon>
        <SettingsOutlinedIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText slotProps={{ primary: { variant: "body2" } }}>
        Paramètres vidéo et audio
      </ListItemText>
    </MenuItem>
  );
};

SettingOption.propTypes = { onClose: PropTypes.func };

export default React.memo(LocalOptions);
