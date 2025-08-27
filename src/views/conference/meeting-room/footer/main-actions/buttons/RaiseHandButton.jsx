import FrontHandOutlinedIcon from "@mui/icons-material/FrontHandOutlined";
import React from "react";
import ActionButton from "./ActionButton";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updateConferenceData } from "../../../../../../redux/conference/conference";
import useSocket from "../../../../../../hooks/useSocket";

const RaiseHandButton = ({ onClose }) => {
  const raiseHand = useSelector(
    (store) => store.conference.meeting.actions.raiseHand
  );

  const dispatch = useDispatch();
  const socket = useSocket();

  return (
    <ActionButton
      id='raise-hand'
      title={raiseHand ? "Baisser la main" : "Lever la main"}
      onClick={() => {
        //socket.emit("raise-hand", { raiseHand: !raiseHand });
        dispatch(
          updateConferenceData({
            key: "meeting.actions.raiseHand",
            data: !raiseHand,
          })
        );
        if (typeof onClose === "function") onClose();
      }}
      selected={raiseHand}>
      <FrontHandOutlinedIcon />
    </ActionButton>
  );
};

RaiseHandButton.propTypes = {
  onClose: PropTypes.func,
};

export default React.memo(RaiseHandButton);
