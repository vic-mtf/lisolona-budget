import React, { useState, useEffect, useRef } from 'react';
import { Button, Grid } from '@mui/material';

const AudioRecorder = () => {
  const canvasRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    let analyser;
    if (mediaStream) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(mediaStream);
      analyser = audioContext.createAnalyser();
      source.connect(analyser);
    }

    const drawWaveform = () => {
      requestAnimationFrame(drawWaveform);
      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = v * canvas.height / 2;
          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      }
    };

    drawWaveform();
  }, [mediaStream]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setMediaStream(stream);

    const recorder = new MediaRecorder(stream);
    recorder.addEventListener('dataavailable', (event) => {
      const blob = new Blob([event.data], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      console.log(url);
    });

    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (isRecording) {
      mediaRecorder.stop();
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaStream(null);
      setMediaRecorder(null);
      setIsRecording(false);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <canvas ref={canvasRef} width="100%" height="100"></canvas>
      </Grid>
      <Grid item xs={6}>
        <Button variant="contained" color="primary" onClick={startRecording} disabled={isRecording}>
          Enregistrer
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button variant="contained" color="secondary" onClick={stopRecording} disabled={!isRecording}>
          Arrêter
        </Button>
      </Grid>
    </Grid>
  );
};

export default AudioRecorder;
