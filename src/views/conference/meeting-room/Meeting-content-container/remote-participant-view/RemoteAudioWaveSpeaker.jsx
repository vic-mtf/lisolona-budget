import { useMemo } from "react";
import SpeakingWave from "../../../../../components/SpeakingWave";
import { generateColorsFromId } from "../../../../../utils/genColorById";
import PropTypes from "prop-types";
import useRemoteVolumeAudioTrack from "../../agora-actions-wrapper/hooks/useRemoteAudioTrack";
import { useAudioTrack } from "../../agora-actions-wrapper/hooks/useRemoteUsersTrack";

const RemoteAudioWaveSpeaker = ({ id }) => {
  const audioTrack = useAudioTrack(id);
  const volume = useRemoteVolumeAudioTrack(audioTrack);
  const color = useMemo(() => generateColorsFromId(id).background, [id]);
  return <SpeakingWave volume={volume} color={color} />;
};

RemoteAudioWaveSpeaker.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default RemoteAudioWaveSpeaker;
