import React, { useRef, useEffect } from "react";

const VoiceWaveform = ({
  audioUrl,
  duration, // durée totale en secondes
  currentTime, // temps lu en secondes
  barWidth = 6,
  gap = 4,
  barRadius = 3,
  barHeightRatio = 0.9,
  colorRead = "#4a90e2", // Couleur lue
  colorUnread = "#d0d0d0", // Couleur non lue
  canvasWidth = 400,
  canvasHeight = 100,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const drawWaveform = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const samples = Math.floor(canvasWidth / (barWidth + gap));
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const rawData = audioBuffer.getChannelData(0);
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];

      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[i * blockSize + j]);
        }
        filteredData.push(sum / blockSize);
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const totalWidth = samples * (barWidth + gap);
      const startX = (canvasWidth - totalWidth) / 2;
      const readRatio = duration > 0 ? currentTime / duration : 0;
      const readIndex = Math.floor(readRatio * samples);

      for (let i = 0; i < samples; i++) {
        const x = startX + i * (barWidth + gap);
        const rawHeight = filteredData[i] * canvasHeight * barHeightRatio;
        const minHeight = 2;
        const barHeight = Math.max(rawHeight, minHeight);
        const y = (canvasHeight - barHeight) / 2;

        // Couleur selon lecture
        ctx.fillStyle = i <= readIndex ? colorRead : colorUnread;

        // Barres arrondies
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, barRadius);
        ctx.fill();
      }
    };

    CanvasRenderingContext2D.prototype.roundRect ||= function (x, y, w, h, r) {
      this.beginPath();
      this.moveTo(x + r, y);
      this.lineTo(x + w - r, y);
      this.quadraticCurveTo(x + w, y, x + w, y + r);
      this.lineTo(x + w, y + h - r);
      this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      this.lineTo(x + r, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - r);
      this.lineTo(x, y + r);
      this.quadraticCurveTo(x, y, x + r, y);
      this.closePath();
    };

    drawWaveform();
  }, [
    audioUrl,
    duration,
    currentTime,
    barWidth,
    gap,
    barRadius,
    barHeightRatio,
    colorRead,
    colorUnread,
    canvasWidth,
    canvasHeight,
  ]);

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
};

export default VoiceWaveform;
