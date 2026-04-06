import FrontHandOutlinedIcon from "@mui/icons-material/FrontHandOutlined";
import React from "react";
import ActionButton from "./ActionButton";
import { useDispatch, useSelector } from "react-redux";
import { updateConferenceData } from "@/redux/conference/conference";
import useSocket from "@/hooks/useSocket";

const RaiseHandButton = ({ onClose }) => {
  const state = useSelector(
    (store) => store.conference.meeting.actions.raiseHand
  );

  const dispatch = useDispatch();
  const socket = useSocket();

  return (
    <ActionButton
      id='raise-hand'
      title={state ? "Baisser la main" : "Lever la main"}
      onClick={() => {
        const handRaised = !state;
        socket.emit("signal-room", { state: { handRaised } });
        dispatch(
          updateConferenceData({
            key: "meeting.actions.raiseHand",
            data: handRaised,
          })
        );
        if (typeof onClose === "function") onClose();
      }}
      selected={state}>
      <FrontHandOutlinedIcon />
    </ActionButton>
  );
};

export default React.memo(RaiseHandButton);
