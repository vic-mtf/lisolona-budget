import React, { useState, useEffect, useRef, useCallback } from 'react';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';


export default function AudioLevelIndicator ({ stream }) {
  const [analyser, setAnalyser] = useState(null);

  useEffect(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(stream) {
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      analyser.fftSize = 2048;
      source.connect(analyser);
      setAnalyser(analyser)
    }
    return () => {
      audioCtx.close();
    };
  }, [stream]);

  return <AudioLevelIndicatorBar analyser={analyser} />;
};

const AudioLevelIndicatorBar = ({ analyser }) => {
    const [volume, setVolume] = useState(0);
    const requestRef = useRef();
    const updateVolume = useCallback(() => {
        if (!analyser) return;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        new Array(bufferLength).fill('').forEach((_, i) => {
            sum += dataArray[i];
        });
        const avg = sum / bufferLength;
        const maxVolume = 255;
        const newVolume = Math.floor((avg / maxVolume) * 100);
        setVolume(newVolume);
        requestRef.current = requestAnimationFrame(updateVolume);
    }, [analyser]);
  
    useEffect(() => {
      requestRef.current = requestAnimationFrame(updateVolume);
      return () => cancelAnimationFrame(requestRef.current);
    }, [updateVolume]);
  
    return <LinearProgress  
            variant="determinate" 
            value={volume} 
            sx={{ 
              [`& .${linearProgressClasses.bar}`]: {
                transition: 'none',
              },
            }}
          />;
  };
  