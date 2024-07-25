import { useCallback } from "react";
import { useDispatch } from "react-redux";
import openNewWindow from "../../../utils/openNewWindow";
import { encrypt } from "../../../utils/crypt";
import { setData } from "../../../redux/meeting";
import { useSocket } from "../../../utils/SocketIOProvider";
import { useData } from "../../../utils/DataProvider";

export default function useHandleJoinMeeting(initMode = "prepare") {
  const dispatch = useDispatch();
  const socket = useSocket();
  const [{ secretCode }] = useData();

  const handleJoinMeeting = useCallback(
    ({ timer, data: target, origin, defaultMode = initMode }) => {
      window.clearInterval(timer);
      const mode = defaultMode || "prepare";
      const wd = openNewWindow({
        url: "/meeting/",
      });

      wd.geidMeetingData = encrypt({
        target,
        mode,
        secretCode: secretCode,
        defaultCallingState: "incoming",
        origin,
      });
      if (wd) {
        dispatch(setData({ data: { mode } }));
        wd.openerSocket = socket;
      }
      return wd;
    },
    [dispatch, socket, secretCode, initMode]
  );
  return handleJoinMeeting;
}
