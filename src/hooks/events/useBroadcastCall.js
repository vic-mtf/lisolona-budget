import { useEffect } from "react";
import { CALL_CHANNEL } from "../../utils/broadcastChannel";
import store from "../../redux/store";

const useBroadcastCall = () => {
  useEffect(() => {
    const onCallStateChanged = (e) => {
      if (e.origin === window.location.origin) {
        if (e.data?.type === "request") {
          const callTarget = store.getState().conference.callTarget;
          if (callTarget)
            CALL_CHANNEL.postMessage({ type: "response", callTarget });
        }
      }
    };
    CALL_CHANNEL.addEventListener("message", onCallStateChanged);

    return () => {
      CALL_CHANNEL.removeEventListener("message", onCallStateChanged);
    };
  }, []);
};

export default useBroadcastCall;
