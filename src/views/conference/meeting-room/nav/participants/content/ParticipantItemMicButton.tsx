import IconButton from "@mui/material/IconButton";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import { updateConferenceData } from "@/redux/conference/conference";
import { useCallback, useMemo } from "react";
import useSocket from "@/hooks/useSocket";
import useIsOrganizer from "@/hooks/useIsOrganizer";

const ParticipantItemMicButton = ({ type, isMicActive, name, id }) => {
  const fn = useMemo(() => name?.split(/\s/)[0], [name]);
  const isOrganizer = useIsOrganizer();
  const dispatch = useDispatch();
  const socket = useSocket();
  const permission = useSelector(
    (state) => state.conference.setup.devices.microphone.permission
  );

  const handleToggleMic = useCallback(() => {
    if (type === "local")
      dispatch(
        updateConferenceData({
          data: {
            setup: { devices: { microphone: { enabled: !isMicActive } } },
          },
        })
      );
    if (type === "remote") {
      socket.emit("signal-room", {
        state: { isMicActive: !isMicActive },
        participants: [id],
      });
      dispatch(
        updateConferenceData({
          key: [`meeting.participants.${id}.state.isMicActive`],
          data: [!isMicActive],
        })
      );
    }
  }, [type, isMicActive, dispatch, socket, id]);

  const notPermission =
    type === "local" && (permission ? permission !== "granted" : true);
  const canNotActivaRemote =
    type === "remote" && (!isMicActive || !isOrganizer);

  const texts = {
    local: {
      active: "Micro activé",
      inactive: "Micro désactivé",
    },
    remote: {
      active: isOrganizer
        ? `Désactiver le micro de ${fn}`
        : `Micro de ${fn} activé`,
      inactive: `Micro de ${fn} désactivé`,
    },
    notPermission: "Permission non accordée",
  };

  return (
    <Tooltip
      title={
        notPermission
          ? texts.notPermission
          : texts[type]?.[isMicActive ? "active" : "inactive"]
      }>
      <div>
        <IconButton
          size='small'
          onClick={handleToggleMic}
          disabled={canNotActivaRemote || notPermission}>
          {isMicActive ? (
            <MicNoneOutlinedIcon fontSize='small' />
          ) : (
            <MicOffOutlinedIcon fontSize='small' />
          )}
        </IconButton>
      </div>
    </Tooltip>
  );
};
export default ParticipantItemMicButton;
