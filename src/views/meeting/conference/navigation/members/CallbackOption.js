import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Stack, Tooltip } from "@mui/material";
import IconButton from "../../../../../components/IconButton";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LoadingIndicator from "./LoadingIndicator";
import { useSocket } from "../../../../../utils/SocketIOProvider";
import CustomZoom from "../../../../../components/CustomZoom";
import store from "../../../../../redux/store";

export default function CallbackOption({ rootRef, id }) {
  const [show, setShow] = useState(false);
  const [ringing, setRinging] = useState(false);
  const socket = useSocket();
  const timerRef = useRef();

  const handleRinging = useCallback(
    (event) => {
      if (event.where._id === store.getState().meeting.meetingId) {
        const member = event?.who;
        window.setTimeout(timerRef.current);
        if (member._id === id) {
          if (!ringing) setRinging(true);
          timerRef.current = setTimeout(() => {
            setRinging(false);
          }, 2000);
        }
      }
    },
    [id, ringing]
  );

  const handleCallback = useCallback(
    (event) => {
      const meetingId = store.getState().meeting.meetingId;
      socket.emit("call", {
        id: meetingId,
        type: "room",
        who: [id],
      });
      handleRinging({ who: { _id: id }, where: { _id: meetingId } });
    },
    [socket, handleRinging, id]
  );

  useLayoutEffect(() => {
    socket.on("ringing", handleRinging);
    return () => {
      socket.off("ringing", handleRinging);
    };
  }, [socket, handleRinging]);

  useLayoutEffect(() => {
    const root = rootRef?.current;
    const onMouseEnter = () => {
      if (!show) setShow(true);
    };
    const onMouseLeave = () => {
      if (show) setShow(false);
    };
    root?.addEventListener("mouseenter", onMouseEnter);
    root?.addEventListener("mouseleave", onMouseLeave);
    return () => {
      socket.off("ringing", handleRinging);
      root?.removeEventListener("mouseenter", onMouseEnter);
      root?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [socket, handleRinging, rootRef, show]);

  return (
    <Stack>
      <CustomZoom show={show || ringing}>
        <div>
          <Tooltip title={ringing ? "Appel en cours..." : "Rappeler"} arrow>
            <div>
              {ringing ? (
                <LoadingIndicator />
              ) : (
                <IconButton onClick={handleCallback}>
                  <LocalPhoneOutlinedIcon fontSize='small' />
                </IconButton>
              )}
            </div>
          </Tooltip>
        </div>
      </CustomZoom>
    </Stack>
  );
}
