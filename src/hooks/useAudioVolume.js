import { useEffect, useRef, useState } from "react";

const useAudioVolume = (stream) => {
  const [volume, setVolume] = useState(0);
  const rafIdRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const smoothedVolumeRef = useRef(0);

  // Sensibilité : plus haut = plus de réponse aux sons faibles
  const GAIN = 2.5;

  // Réglage de réactivité
  const smoothingFactor = 0.4; // montée rapide
  const decayFactor = 0.93; // descente lente

  useEffect(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.warn("Error cl", e);
      }
      audioContextRef.current = null;
    }

    if (!stream || !(stream instanceof MediaStream)) return;
    const hasAudio = stream.getAudioTracks().length > 0;
    if (!hasAudio) {
      console.warn("No audio track found.");
      return;
    }

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512; // Plus petit = plus sensible, mais bruité

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;

    const updateVolume = () => {
      analyser.getByteTimeDomainData(dataArray);

      // Moyenne des écarts par rapport à la ligne médiane (128)
      const sum = dataArray.reduce((acc, v) => {
        const deviation = v - 128;
        return acc + Math.abs(deviation);
      }, 0);

      const avg = sum / bufferLength;

      // Sensibilité amplifiée artificiellement
      let rawVolume = avg * GAIN;

      // Map vers 0–100
      rawVolume = Math.min(100, Math.max(0, (rawVolume / 64) * 100));

      // Inertie : montée rapide, descente lente
      const previous = smoothedVolumeRef.current;
      let newVolume;
      if (rawVolume > previous)
        newVolume = previous + (rawVolume - previous) * smoothingFactor;
      else newVolume = previous * decayFactor;

      smoothedVolumeRef.current = newVolume;
      setVolume(newVolume);

      rafIdRef.current = requestAnimationFrame(updateVolume);
    };
    updateVolume();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (sourceRef.current) sourceRef.current.disconnect();
      if (analyserRef.current) analyserRef.current.disconnect();
      if (audioContextRef.current) audioContextRef.current.close();

      rafIdRef.current = null;
      sourceRef.current = null;
      analyserRef.current = null;
      audioContextRef.current = null;
    };
  }, [stream]);

  return volume;
};

export default useAudioVolume;
