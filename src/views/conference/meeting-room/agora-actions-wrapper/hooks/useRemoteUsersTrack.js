import React from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const RemoteUsersTrackContext = React.createContext([]);

const useRemoteUsersTrack = () => React.useContext(RemoteUsersTrackContext);

export default useRemoteUsersTrack;

export const useAudioTrack = (id) => {
  const uid = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.uid
  );
  const isMicActive = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.state?.isMicActive
  );
  const remoteTracks = useRemoteUsersTrack();
  const audioTrack = useMemo(
    () => remoteTracks.find((t) => t.uid === uid)?.audioTrack || null,
    [remoteTracks, uid]
  );
  return isMicActive ? audioTrack : null;
};

export const useVideoTrack = (id) => {
  const uid = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.uid
  );
  const isCameraActive = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.state?.isCamActive
  );

  const isHidden = useSelector(
    (store) =>
      store.conference.meeting.actions.liveInteractionGrid.participant.hide?.[
        id
      ] === "video"
  );

  const remoteTracks = useRemoteUsersTrack();
  const videoTrack = useMemo(
    () => remoteTracks.find((t) => t.uid === uid)?.videoTrack || null,
    [remoteTracks, uid]
  );
  return isCameraActive ? (isHidden ? null : videoTrack) : null;
};
