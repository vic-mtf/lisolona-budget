import { useEffect } from "react";
import { useRemoteAudioTracks, useRemoteUsers } from "agora-rtc-react";

const useRemotePublishAudioTrack = (isConnected) => {
  const remoteUsers = useRemoteUsers();
  const { audioTracks, isLoading } = useRemoteAudioTracks(remoteUsers);

  useEffect(() => {
    if (!isConnected || isLoading) return;
    audioTracks.forEach((track) => {
      if (!track.isPlaying) track.play();
    });
  }, [isConnected, isLoading, audioTracks]);
};

export default useRemotePublishAudioTrack;
