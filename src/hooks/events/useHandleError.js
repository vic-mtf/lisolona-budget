import { useNotifications } from "@toolpad/core/useNotifications";
import useSocket from "../useSocket";
import { useEffect } from "react";

const useHandleError = () => {
  const socket = useSocket();
  const notifications = useNotifications();

  useEffect(() => {
    const onHandleError = ({ message }) => {
      console.log("error => ", message);
      notifications.show(message, { severity: "error" });
    };
    socket?.on("error", onHandleError);
    return () => {
      socket?.off("error", onHandleError);
    };
  });
};

export default useHandleError;
