import AgoraRTC, {
  AgoraRTCProvider,
  AgoraRTCScreenShareProvider,
} from "agora-rtc-react";
import { useMemo, useEffect } from "react";
import PropTypes from "prop-types";

AgoraRTC.setLogLevel(4);

export default function AgoraProviderClient({ children }) {
  const RTCClient = useMemo(
    () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
    []
  );
  const RTCScreenShareClient = useMemo(
    () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
    []
  );

  useEffect(() => {
    AgoraRTC.setLogLevel(4);
  }, []);

  return (
    <AgoraRTCProvider client={RTCClient}>
      <AgoraRTCScreenShareProvider client={RTCScreenShareClient}>
        {children}
      </AgoraRTCScreenShareProvider>
    </AgoraRTCProvider>
  );
}

AgoraProviderClient.propTypes = {
  children: PropTypes.node.isRequired,
};
