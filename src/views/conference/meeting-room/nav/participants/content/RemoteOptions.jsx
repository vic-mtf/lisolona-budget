import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
// import CoPresentOutlinedIcon from '@mui/icons-material/CoPresentOutlined';
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';
import RemoveModeratorOutlinedIcon from '@mui/icons-material/RemoveModeratorOutlined';
// import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
// import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { useLocation } from 'react-router-dom';
// import PinInvokeOutlinedIcon from '@mui/icons-material/PinInvokeOutlined';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import ThreePOutlinedIcon from '@mui/icons-material/ThreePOutlined';
import { updateConferenceData } from '../../../../../../redux/conference/conference';
import useSocket from '../../../../../../hooks/useSocket';
import getFullName from '../../../../../../utils/getFullName';
import { useMemo } from 'react';

const RemoteOptions = ({ remoteId, onClose }) => {
  const id = useSelector((store) => store.user.id);
  const isOrganizer = useSelector(
    (store) => store.conference.meeting.participants[id].state.isOrganizer
  );

  return (
    <>
      {isOrganizer && (
        <>
          <CamOption onClose={onClose} id={remoteId} />
          <MicOption onClose={onClose} id={remoteId} />
          <ToggleModerator onClose={onClose} id={remoteId} />
        </>
      )}
      <SendPrivateMessageOption />
    </>
  );
};

const SendPrivateMessageOption = () => {
  return (
    <MenuItem disabled>
      <ListItemIcon>
        <ThreePOutlinedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText slotProps={{ primary: { variant: 'body2' } }}>
        Envoyer un message privé
      </ListItemText>
    </MenuItem>
  );
};

RemoteOptions.propTypes = {
  onClose: PropTypes.func,
  remoteId: PropTypes.string,
};

const CamOption = ({ onClose, id }) => {
  const participant = useSelector(
    (store) => store.conference.meeting.participants[id]?.identity
  );
  const stateCam = useSelector(
    (store) => store.conference.meeting.participants[id]?.state?.isCamActive
  );
  const name = fName(participant);
  const socket = useSocket();

  const dispatch = useDispatch();
  const onToggleCam = () => {
    const isCamActive = !stateCam;
    socket.emit('signal-room', { state: { isCamActive }, participants: [id] });
    dispatch(
      updateConferenceData({
        key: [`meeting.participants.${id}.state.isCamActive`],
        data: [isCamActive],
      })
    );
    if (typeof onClose === 'function') onClose();
  };

  return (
    <MenuItem onClick={onToggleCam} disabled={!stateCam}>
      <ListItemIcon>
        {stateCam ? (
          <VideocamOutlinedIcon fontSize="small" />
        ) : (
          <VideocamOffOutlinedIcon fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={
          stateCam
            ? `Désactiver caméra de ${name}`
            : `Caméra de ${name} désactivée`
        }
        slotProps={{ primary: { variant: 'body2' } }}
      />
    </MenuItem>
  );
};

CamOption.propTypes = { onClose: PropTypes.func, id: PropTypes.string };

const MicOption = ({ onClose, id }) => {
  const participant = useSelector(
    (store) => store.conference.meeting.participants[id]?.identity
  );
  const name = fName(participant);

  const stateMic = useSelector(
    (store) => store.conference.meeting.participants[id]?.state?.isMicActive
  );
  const socket = useSocket();
  const dispatch = useDispatch();

  const onToggleMic = () => {
    const isMicActive = !stateMic;
    socket.emit('signal-room', { state: { isMicActive }, participants: [id] });
    dispatch(
      updateConferenceData({
        key: [`meeting.participants.${id}.state.isMicActive`],
        data: [isMicActive],
      })
    );
    if (typeof onClose === 'function') onClose();
  };

  return (
    <MenuItem onClick={onToggleMic} disabled={!stateMic}>
      <ListItemIcon>
        {stateMic ? (
          <MicNoneOutlinedIcon fontSize="small" />
        ) : (
          <MicOffOutlinedIcon fontSize="small" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={
          stateMic
            ? `Désactiver le micro de ${name}`
            : `Micro de ${name} désactivé`
        }
        slotProps={{ primary: { variant: 'body2' } }}
      />
    </MenuItem>
  );
};

MicOption.propTypes = { onClose: PropTypes.func, id: PropTypes.string };

const ToggleModerator = ({ onClose, id }) => {
  const { state } = useLocation();
  const stateOrganizer = useSelector(
    (store) => store.conference.meeting.participants[id]?.state?.isOrganizer
  );
  const data = useMemo(() => state?.data, [state]);
  const socket = useSocket();
  const dispatch = useDispatch();
  console.log(data);
  const onToggleOrganizeState = () => {
    const isOrganizer = !stateOrganizer;
    socket.emit('signal-room', { state: { isOrganizer }, participants: [id] });
    dispatch(
      updateConferenceData({
        key: [`meeting.participants.${id}.state.isOrganizer`],
        data: [isOrganizer],
      })
    );
    if (typeof onClose === 'function') onClose();
  };
  const createdBy = data?.createdBy?.id || data?.createdBy;

  return (
    createdBy !== id && (
      <MenuItem onClick={onToggleOrganizeState}>
        <ListItemIcon>
          {stateOrganizer ? (
            <RemoveModeratorOutlinedIcon fontSize="small" />
          ) : (
            <AddModeratorOutlinedIcon fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={
            stateOrganizer
              ? `Retirer en tant que modérateur`
              : `Ajouter en tant que modérateur`
          }
          slotProps={{ primary: { variant: 'body2' } }}
        />
      </MenuItem>
    )
  );
};

ToggleModerator.propTypes = {
  onClose: PropTypes.func,
  id: PropTypes.string,
};
const fName = (obj) => getFullName(obj)?.split(/\s/)[0];
export default React.memo(RemoteOptions);
