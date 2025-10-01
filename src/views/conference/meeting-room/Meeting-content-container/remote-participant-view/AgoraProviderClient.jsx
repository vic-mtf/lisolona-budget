import AgoraRTC, {
  AgoraRTCProvider,
  AgoraRTCScreenShareProvider,
} from "agora-rtc-react";
import { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TracksContext } from "../views/conference/meeting-room/agora-actions-wrapper/hooks/useRemoteTracks";
import { useRTCClient } from "agora-rtc-react";

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
    RTCClient.enableAudioVolumeIndicator();
  }, [RTCClient]);

  return (
    <AgoraRTCProvider client={RTCClient}>
      <AgoraRTCScreenShareProvider client={RTCScreenShareClient}>
        {children}
      </AgoraRTCScreenShareProvider>
    </AgoraRTCProvider>
  );
}

export const RemoteTracksProvider = ({ children }) => {
  const [tracks, setTracks] = useState([]);
  const client = useRTCClient();

  useEffect(() => {
    const onUserPublished = (track, mediaType) => {
      if (mediaType === "audio") track.play();
      setTracks(track);
    };
    const onUserUnpublished = (track, mediaType) => {
      if (mediaType === "audio") track.stop();
      setTracks((tracks) =>
        tracks.filter(
          (t) => (t?.getUserId() || t.uid) !== (track?.getUserId() || track.uid)
        )
      );
    };
    client.on("user-published", onUserPublished);
    client.on("user-unpublished", onUserUnpublished);
    return () => {
      client.off("user-published", onUserPublished);
      client.off("user-unpublished", onUserUnpublished);
    };
  }, [client]);

  return (
    blur(50px) value={tracks}>{children}</TracksContext.Provider>
  );
};

RemoteTracksProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
AgoraProviderClient.propTypes = {
  children: PropTypes.node.isRequired,
};
