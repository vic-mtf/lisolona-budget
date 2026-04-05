import { useEffect, useRef, useState } from 'react';

const useRemoteVolumeAudioTrack = (audioTrack) => {
  const [volume, setVolume] = useState(0);
  const rafIdRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const gainRef = useRef(null);
  const smoothedVolumeRef = useRef(0);

  const GAIN = 2.5;
  const smoothingFactor = 0.4;
  const decayFactor = 0.9;

  useEffect(() => {
    // Cas : pas de track ou track non jouable
    if (!audioTrack || typeof audioTrack.getMediaStreamTrack !== 'function') {
      setVolume(0);
      return;
    }

    const mediaStreamTrack = audioTrack.getMediaStreamTrack();
    if (!mediaStreamTrack) {
      setVolume(0);
      return;
    }

    const stream = new MediaStream([mediaStreamTrack]);

    // Nettoyage précédent
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.warn('Error closing context:', e);
      }
      audioContextRef.current = null;
    }

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = GAIN;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(gainNode).connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;
    gainRef.current = gainNode;

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      let rawVolume = Math.min(100, Math.max(0, (avg / 255) * 100));

      const previous = smoothedVolumeRef.current;
      let newVolume;
      if (rawVolume > previous) {
        newVolume = previous + (rawVolume - previous) * smoothingFactor;
      } else {
        newVolume = previous * decayFactor;
      }

      smoothedVolumeRef.current = newVolume;
      setVolume(newVolume);

      rafIdRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (sourceRef.current) sourceRef.current.disconnect();
      if (gainRef.current) gainRef.current.disconnect();
      if (analyserRef.current) analyserRef.current.disconnect();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      rafIdRef.current = null;
      sourceRef.current = null;
      gainRef.current = null;
      analyserRef.current = null;
      audioContextRef.current = null;
      smoothedVolumeRef.current = 0;
      setVolume(0);
    };
  }, [audioTrack]);

  return volume;
};

export default useRemoteVolumeAudioTrack;
