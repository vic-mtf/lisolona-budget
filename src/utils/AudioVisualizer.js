import React, { useEffect, useRef } from "react";

export const AudioVisualizer = React.memo(({analyser, audioTrack, size, maxSize, radius}) => {
    const recRef = useRef();
    const requestAnimationFrameRef = useRef();
  
    useEffect(() => {
    if(!analyser && !audioTrack) return () => {};
      let bufferLength;
      let dataArray;
      if (analyser) {
        analyser.fftSize = 64;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
      }
      const {current: rect} = recRef;
      
      function renderFrame() {
        requestAnimationFrameRef.current = requestAnimationFrame(renderFrame);
        analyser?.getByteFrequencyData(dataArray);
        let volume;
        if (analyser) {
          analyser.getByteTimeDomainData(dataArray);
          volume = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
          volume /= 255;
        }
        if(audioTrack) volume = audioTrack?.getVolumeLevel()
        const rectSize = getValue(maxSize, size, volume);
        const rectCoord = ( maxSize - rectSize ) / 2;
        rect.setAttribute("width", rectSize);
        rect.setAttribute("height", rectSize);
        rect.setAttribute("x", rectCoord);
        rect.setAttribute("y", rectCoord);
      }
      renderFrame();
      return () => {
        window.cancelAnimationFrame(requestAnimationFrameRef.current);
      };
    }, [analyser, size, maxSize, audioTrack]);
  
    return (
      <svg
        height={maxSize}
        width={maxSize}
      >
        <rect 
          rx={radius}
          fill="transparent" 
          stroke="red"
          ref={recRef}
          strokeWidth={2.5}
        />
      </svg>
    );
  });
  
  AudioVisualizer.defaultProps = {
    size: 200,
    maxSize: 300,
    radius: 10,
  };

  function getValue(max, min, percentage) {
    return min + (max - min) * percentage;
  }