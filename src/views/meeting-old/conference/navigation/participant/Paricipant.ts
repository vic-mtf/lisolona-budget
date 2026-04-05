import { useMeetingData } from "../../../../../utils/MeetingProvider";
import { Box as Mui } from "@mui/material";
import { useState } from "react";
import ViewAudioTrack from "./ViewAudioTrack";
import ViewVideoTrack from "./ViewVideoTrack";

export default function Paricipant({ uid, id, name, email, avatarSrc }) {
  const [, { settersRemoteAudioTracks, settersRemoteVideoTracks }] =
    useMeetingData();
  const [audioTrack, setAudioTrack] = useState(
    settersRemoteAudioTracks.getObjectValueById(id, "audioTrack")
  );
  const [videoTrack, setVideoTrack] = useState(
    settersRemoteVideoTracks.getObjectValueById(id, "videoTrack")
  );

  return (
    <Mui boxShadow={1} borderRadius={1}>
      {videoTrack && <ViewVideoTrack />}
      {audioTrack && <ViewAudioTrack />}
    </Mui>
  );
}
