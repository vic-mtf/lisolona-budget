import { useEffect } from "react";
import { CALL_CHANNEL } from "../../utils/broadcastChannel";
import store from "../../redux/store";

const useBroadcastCall = () => {
  useEffect(() => {
    const onCallStateChanged = (event) => {
      console.log("Call state changed:", event.data);
    };

    CALL_CHANNEL.addEventListener("message", (e) => {
      if (e.origin === window.location.origin) {
        if (e.data?.type === "request") {
          const callTarget = store.getState().conference.callTarget;
          if (callTarget)
            CALL_CHANNEL.postMessage({ type: "response", callTarget });
        }
      }
    });

    return () => {
      CALL_CHANNEL.removeEventListener("message", onCallStateChanged);
    };
  }, []);
};

export default useBroadcastCall;
