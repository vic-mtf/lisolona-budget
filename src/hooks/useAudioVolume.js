import { useEffect, useRef, useState } from "react";

const useAudioVolume = (stream) => {
  const [volume, setVolume] = useState(0);
  const rafIdRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    // Nettoyage précédent
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.warn("Erreur lors de la fermeture du contexte audio :", e);
      }
      audioContextRef.current = null;
    }

    // Vérification du stream et de la présence de pistes audio
    if (!stream || !(stream instanceof MediaStream)) return;
    const hasAudio = stream.getAudioTracks().length > 0;
    if (!hasAudio) {
      console.warn("Le MediaStream ne contient pas de piste audio.");
      return;
    }

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((acc, val) => acc + val, 0);
      const avg = sum / bufferLength;

      const percentVolume = Math.min(100, Math.max(0, (avg / 255) * 100));
      setVolume(percentVolume);

      rafIdRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch (e) {
          console.warn("Erreur lors de la déconnexion de la source :", e);
        }
        sourceRef.current = null;
      }

      if (analyserRef.current) {
        try {
          analyserRef.current.disconnect();
        } catch (e) {
          console.warn("Erreur lors de la déconnexion de l’analyseur :", e);
        }
        analyserRef.current = null;
      }

      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          console.warn("Erreur lors de la fermeture du contexte audio :", e);
        }
        audioContextRef.current = null;
      }
    };
  }, [stream]);

  return volume;
};

export default useAudioVolume;
