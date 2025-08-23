import { useEffect, useRef, useState } from "react";

const useAudioVolume = (stream) => {
  const [volume, setVolume] = useState(0);
  const rafIdRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const gainRef = useRef(null);
  const smoothedVolumeRef = useRef(0);

  // Sensibilité : multiplier l’énergie détectée
  const GAIN = 2.5;

  // Réglage inertie
  const smoothingFactor = 0.4; // montée rapide
  const decayFactor = 0.9; // descente lente

  useEffect(() => {
    // Cas : pas de stream ou inactif → reset
    if (!stream || !stream.active || stream.getAudioTracks().length === 0) {
      setVolume(0);
      return;
    }

    // Nettoyer ancienne loop
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // Fermer ancien contexte
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.warn("Error closing context:", e);
      }
      audioContextRef.current = null;
    }

    // Création graphe audio
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = GAIN; // amplification

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024; // résolution fréquence
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(gainNode).connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;
    gainRef.current = gainNode;

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);

      // Calcul énergie spectrale moyenne
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;

      // Normalisation 0–100
      let rawVolume = Math.min(100, Math.max(0, (avg / 255) * 100));

      // Inertie (montée rapide / descente lente)
      const previous = smoothedVolumeRef.current;
      let newVolume;
      if (rawVolume > previous) {
        newVolume = previous + (rawVolume - previous) * smoothingFactor;
      } else {
        newVolume = previous * decayFactor;
      }

      smoothedVolumeRef.current = newVolume;
      setVolume(newVolume);

      // Si stream inactif → reset à 0
      if (!stream.active || stream.getAudioTracks().length === 0) {
        smoothedVolumeRef.current = 0;
        setVolume(0);
        return;
      }

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
  }, [stream]);

  return volume;
};

export default useAudioVolume;
