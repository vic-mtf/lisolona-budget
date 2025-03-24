import { useEffect } from "react";
import useLocalStoreData from "../useLocalStoreData";
import useSocket from "../useSocket";
import { useState } from "react";

const useListenRemoteUserStatus = (userId) => {
  const [getData, setData] = useLocalStoreData();
  const [status, setStatus] = useState(
    getData((data) => {
      const value = data?.app?.contacts?.status;
      return value ? value[userId] : null;
    })
  );
  const socket = useSocket();

  useEffect(() => {
    const updateStatus = (status, id) =>
      setData("app.contacts.status." + id, status);
    const status = getData((data) => data.app.contacts.status[userId]);

    if (userId && !status) {
      updateStatus("loading", userId);
      socket?.emit("status", { who: userId });
    }

    const userToggleStatus = (user) => {
      if (userId === user?.who && user?.status !== status)
        setStatus(user?.status);
      updateStatus(user?.status, user?.who);
    };

    socket?.on("status", userToggleStatus);

    return () => socket?.off("status", userToggleStatus);
  }, [socket, getData, setData, userId]);

  return status;
};

export default useListenRemoteUserStatus;
