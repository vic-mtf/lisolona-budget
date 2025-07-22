import React, { useState, useRef } from "react";

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioStreamRef.current = stream;
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      mediaRecorderRef.current.requestData();
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };
  const playPreview = () => {
    if (audioChunksRef.current.length > 0) {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      const previewAudio = new Audio(url);
      previewAudio.play();
    }
  };

  return (
    <div>
      <h2>🎤 Enregistreur vocal</h2>
      {!recording ? (
        <button onClick={startRecording}>Démarrer</button>
      ) : (
        <>
          <button onClick={pauseRecording}>Pause</button>
          <button onClick={resumeRecording}>Reprendre</button>
          <button onClick={stopRecording}>Stop</button>
        </>
      )}
      {recording && (
        <button onClick={playPreview}>
          🎧 Écouter ce qui a été enregistré
        </button>
      )}

      {audioUrl && (
        <div>
          <h3>✅ Audio enregistré :</h3>
          <audio controls src={audioUrl} />
          <a href={audioUrl} download='enregistrement.webm'>
            📥 Télécharger
          </a>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
