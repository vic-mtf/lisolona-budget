import React, { useMemo } from "react";
import Client from "./Client";
import { useMeetingData } from "../../../../../utils/MeetingProvider";
import PropTypes from "prop-types";

const Participant = React.memo(({ uid, name, id, avatarSrc }) => {
  const [, { settersRemoteVideoTracks, settersRemoteAudioTracks }] =
    useMeetingData();

  const audioTrack = useMemo(
    () => settersRemoteAudioTracks.getTrackById(id)?.audioTrack || null,
    [settersRemoteAudioTracks, id]
  );

  const videoTrack = useMemo(
    () => settersRemoteVideoTracks.getTrackById(id)?.videoTrack || null,
    [settersRemoteVideoTracks, id]
  );

  return (
    <Client
      audioTrack={audioTrack}
      videoTrack={videoTrack}
      showVideo={Boolean(videoTrack)}
      name={name}
      id={id}
      uid={uid}
      avatarSrc={avatarSrc}
    />
  );
});

Participant.propTypes = {
  uid: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  avatarSrc: PropTypes.string,
};

Participant.displayName = "Participant";

export default Participant;
