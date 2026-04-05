import { useMemo } from 'react';
import SpeakingWave from '../../../../../components/SpeakingWave';
import useAudioVolume from '../../../../../hooks/useAudioVolume';
import { noiseSuppressor } from '../../../../../utils/NoiseSuppressor';
import { generateColorsFromId } from '../../../../../utils/genColorById';
import { useSelector } from 'react-redux';

const AudioWaveSpeaker = ({ id }) => {
  const isMicActive = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.state.isMicActive
  );
  const volume = useAudioVolume(
    isMicActive ? noiseSuppressor.getProcessedStream() : null
  );
  const color = useMemo(() => generateColorsFromId(id).background, [id]);
  return <SpeakingWave volume={volume} color={color} />;
};

export default AudioWaveSpeaker;
