import { useMemo } from "react";
import SpeakingWave from "@/components/SpeakingWave";
import { generateColorsFromId } from "@/utils/genColorById";
import useRemoteVolumeAudioTrack from "@/views/conference/meeting-room/agora-actions-wrapper/hooks/useRemoteAudioTrack";
import { useAudioTrack } from "@/views/conference/meeting-room/agora-actions-wrapper/hooks/useRemoteUsersTrack";

const RemoteAudioWaveSpeaker = ({ id }) => {
  const audioTrack = useAudioTrack(id);
  const volume = useRemoteVolumeAudioTrack(audioTrack);
  const color = useMemo(() => generateColorsFromId(id).background, [id]);
  return <SpeakingWave volume={volume} color={color} />;
};

export default RemoteAudioWaveSpeaker;
