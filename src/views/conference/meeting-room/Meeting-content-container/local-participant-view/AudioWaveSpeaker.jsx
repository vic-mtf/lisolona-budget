import { useMemo } from "react";
import SpeakingWave from "../../../../../components/SpeakingWave";
import useAudioVolume from "../../../../../hooks/useAudioVolume";
import { noiseSuppressor } from "../../../../../utils/NoiseSuppressor";
import { generateColorsFromId } from "../../../../../utils/genColorById";
import PropTypes from "prop-types";

const AudioWaveSpeaker = ({ id }) => {
  const volume = useAudioVolume(noiseSuppressor.getProcessedStream());
  const color = useMemo(() => generateColorsFromId(id).background, [id]);
  return <SpeakingWave volume={volume} color={color} />;
};

AudioWaveSpeaker.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default AudioWaveSpeaker;
