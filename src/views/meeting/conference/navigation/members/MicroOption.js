import { Tooltip } from "@mui/material";
import IconButton from "../../../../../components/IconButton";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import { useMemo } from "react";
import useMicroProps from "../../footer/buttons/useMicroProps";
import { useSelector } from "react-redux";
import useClientState from "../../actions/useClientState";
import useSocket from "../../../../../hooks/useSocket";
import store from "../../../../../redux/store";

export default function MicroOption({ active, id }) {
  const user = useSelector((store) => store.meeting.me);
  const isLocalMicro = useMemo(() => user?.id === id, [id, user]);
  const { micro, handleToggleMicro, loading } = useMicroProps();
  const state = useClientState({ id: user.id, props: ["isOrganizer"] });
  const activeMicro = useMemo(
    () => (isLocalMicro ? micro?.active : active),
    [isLocalMicro, micro, active]
  );
  const socket = useSocket();

  const IconButtonProps = useMemo(
    () =>
      state.isOrganizer
        ? {
            onClick() {
              const meetingId = store.getState().meeting.meetingId;
              if (isLocalMicro) handleToggleMicro();
              else if (state.isOrganizer)
                socket.emit("signal", {
                  id: meetingId,
                  type: "state",
                  obj: { isMic: false },
                  who: [id],
                });
            },
          }
        : {
            disableFocusRipple: true,
            disableRipple: true,
            disableTouchRipple: true,
            onClick() {
              if (isLocalMicro) handleToggleMicro();
            },
          },
    [state, handleToggleMicro, isLocalMicro, id, socket]
  );

  return (
    <Tooltip title={message(activeMicro, state.isOrganizer)} arrow>
      <div>
        <IconButton
          disabled={isLocalMicro ? loading : !active}
          {...IconButtonProps}
          selected={activeMicro}>
          {activeMicro ? <MicNoneOutlinedIcon /> : <MicOffOutlinedIcon />}
        </IconButton>
      </div>
    </Tooltip>
  );
}

const message = (active, isOrganizer) =>
  isOrganizer
    ? `${active ? "Desactiver" : "Activer"} le micro`
    : `Micro ${active ? "Activé" : "Desactivé"}`;
