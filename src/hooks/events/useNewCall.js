import { useEffect } from "react";
import { CALL_CHANNEL } from "../../utils/broadcastChannel";
import useSocket from "../useSocket";
import store from "../../redux/store";

const useNewCall = () => {
  const socket = useSocket();

  useEffect(() => {
    const onCallStateChanged = (e) => {
      if (e.origin === window.location.origin) {
        if (e.data?.type === "create") {
          const newCall = { ...e.data?.call };
          if (typeof newCall?.location === "string") {
            const discussions = store.getState().data.app.discussions;
            const discussion = discussions.find(
              (d) => d?.id === newCall?.location
            );
            if (discussion) {
              newCall.location = discussion;
              delete discussion?.messages;
            }
          }
          const calls = store.getState().data.app.calls;
          const find = calls.find((c) => c.id === newCall?.id);
          if (!find) {
            store.dispatch({
              type: "data/updateData",
              payload: {
                key: ["app.calls"],
                data: [[newCall, ...calls]],
              },
            });
          }
        }
      }
    };
    const onNewCall = async (data) => {};

    CALL_CHANNEL.addEventListener("message", onCallStateChanged);
    socket?.on("call", onNewCall);

    return () => {
      CALL_CHANNEL.removeEventListener("message", onCallStateChanged);
      socket?.off("call", onNewCall);
    };
  }, [socket]);
};

export default useNewCall;
