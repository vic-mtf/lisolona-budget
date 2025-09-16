import { useEffect, useMemo } from "react";
import useSocket from "../useSocket";
import store from "../../redux/store";
import { useLocation } from "react-router-dom";
import { useNotifications } from "@toolpad/core/useNotifications";
import ringtones from "../../utils/ringtones";
import normalizeObjectKeys from "../../utils/normalizeObjectKeys";

const useRemoteUserJoin = () => {
  const socket = useSocket();
  const { state } = useLocation();
  const id = useMemo(() => state?.data?.id, [state?.data]);
  const notifications = useNotifications();

  useEffect(() => {
    const onRemoteUserJoin = (d) => {
      const data = normalizeObjectKeys(d);
      const userId = store.getState().user.id;
      const remoteUserId = data?.id;

      if (userId === remoteUserId) return;
      const participants = {
        ...store.getState().conference.meeting.participants,
      };
      if (!participants[remoteUserId]) return;
      const participant = { ...participants[remoteUserId] };
      store.dispatch({
        type: "conference/updateConferenceData",
        payload: {
          data: {
            meeting: {
              participants: {
                [remoteUserId]: {
                  ...participant,
                  state: { ...data?.state, isInRoom: true },
                  auth: data?.auth,
                },
              },
            },
          },
        },
      });
      ringtones.active.play();
      ringtones.active.volume = 0.1;
      notifications.close(remoteUserId);
    };
    socket?.on("join-room", onRemoteUserJoin);
    return () => {
      socket?.off("join-room", onRemoteUserJoin);
    };
  }, [socket, id, notifications]);
  return null;
};

export default useRemoteUserJoin;
