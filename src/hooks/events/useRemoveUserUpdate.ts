import { useEffect } from "react";
import useSocket from "../useSocket";
import normalizeObjectKeys from "@/utils/normalizeObjectKeys";
import store from "@/redux/store";

const useRemoteUserUpdate = () => {
  const socket = useSocket();

  useEffect(() => {
    const onRemoteUserUpdate = (d) => {
      const data = Array.isArray(d)
        ? d.map((d) => normalizeObjectKeys(d))
        : [normalizeObjectKeys(d)];
      const participants = {};
      for (const d of data) {
        const id = d?.identity?.id;
        if (id) participants[d?.identity?.id] = d;
      }
      store.dispatch({
        type: "conference/updateConferenceData",
        payload: {
          data: { meeting: { participants } },
        },
      });
    };
    socket?.on("update-room", onRemoteUserUpdate);
    return () => {
      socket?.off("update-room", onRemoteUserUpdate);
    };
  }, [socket]);
};

export default useRemoteUserUpdate;
