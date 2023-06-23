import { useTheme } from '@mui/material';
import React, { useRef, useEffect } from 'react';

function FrequencyAnalyzer({ analyserRef }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    if (!analyserRef.current) {
      return () => {};
    }

    function draw() {
      animationRef.current = requestAnimationFrame(draw);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      //.fillRect(0, 0, canvasWidth, canvasHeight);

      const barWidth = (canvasWidth / bufferLength) * 20;
      let x = centerX - (barWidth + 1) * bufferLength / 4;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 4;

        canvasCtx.fillStyle = theme.palette.primary.main;
        fillRoundRect(canvasCtx, x, centerY - barHeight / 2, barWidth, barHeight)
        //canvasCtx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);

        x += barWidth + 2;
      }
    }

    if (analyserRef.current) {
      animationRef.current = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [analyserRef, theme.palette.primary.main]);

  return <canvas ref={canvasRef} width={250} height={60} style={{maxHeight: 250}} />;
}

export default FrequencyAnalyzer;

function fillRoundRect(canvasCtx, x, y, width, height, round = 2) {
  canvasCtx.beginPath();
  canvasCtx.moveTo(x + round, y);
  canvasCtx.lineTo(x + width - round, y);
  canvasCtx.arcTo(x + width, y, x + width, y + round, round);
  canvasCtx.lineTo(x + width, y + height - round);
  canvasCtx.arcTo(x + width, y + height, x + width - round, y + height, round);
  canvasCtx.lineTo(x + round, y + height);
  canvasCtx.arcTo(x, y + height, x, y + height - round, round);
  canvasCtx.lineTo(x, y + round);
  canvasCtx.arcTo(x, y, x + round, y, round);
  canvasCtx.closePath();
  canvasCtx.fill();
}
