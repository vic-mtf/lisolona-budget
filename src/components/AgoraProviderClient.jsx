import AgoraRTC, {
  AgoraRTCProvider,
  AgoraRTCScreenShareProvider,
} from "agora-rtc-react";
import { useMemo } from "react";

export default function AgoraProviderClient({ children }) {
  const RTCClient = useMemo(
    () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
    []
  );
  const RTCScreenShareClient = useMemo(
    () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
    []
  );

  return (
    <AgoraRTCProvider client={RTCClient}>
      <AgoraRTCScreenShareProvider client={RTCScreenShareClient}>
        {children}
      </AgoraRTCScreenShareProvider>
    </AgoraRTCProvider>
  );
}
