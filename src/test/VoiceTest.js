import React, { useState, useEffect, useRef, useMemo } from "react";

export const AudioVisualizer = React.memo(
  ({ size = 200, maxSize = 300, radius = 10, analyser, audioTrack }) => {
    const recRef = useRef();
    const requestAnimationFrameRef = useRef();

    useEffect(() => {
      let bufferLength;
      let dataArray;
      if (analyser) {
        analyser.fftSize = 64;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
      }
      const { current: rect } = recRef;

      function renderFrame() {
        requestAnimationFrameRef.current = requestAnimationFrame(renderFrame);
        analyser?.getByteFrequencyData(dataArray);
        let volume;
        if (analyser) {
          analyser.getByteTimeDomainData(dataArray);
          volume = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
          volume /= 255;
        }
        if (audioTrack) volume = audioTrack?.getVolumeLevel();
        const rectSize = getValue(maxSize, size, volume);

        const rectCoord = (maxSize - rectSize) / 2;
        rect.setAttribute("width", rectSize);
        rect.setAttribute("height", rectSize);
        rect.setAttribute("x", rectCoord);
        rect.setAttribute("y", rectCoord);
      }
      if (audioTrack || analyser) renderFrame();
      else window.cancelAnimationFrame(requestAnimationFrameRef.current);
      return () => {
        window.cancelAnimationFrame(requestAnimationFrameRef.current);
      };
    }, [analyser, size, maxSize, audioTrack]);

    return (
      <svg height={maxSize} width={maxSize}>
        <rect
          rx={radius}
          fill='transparent'
          stroke='red'
          ref={recRef}
          strokeWidth={2.5}
        />
      </svg>
    );
  }
);

function getValue(max, min, percentage) {
  return min + (max - min) * percentage;
}

export const VoiceTest = ({ src }) => {
  const [analyser, setAnalyser] = useState(null);
  const audio = useMemo(() => new Audio(src), [src]);
  const analyserRef = useRef(null);
  const handleClick = (event) => {
    if (audio.paused) {
      audio.play();
      if (analyserRef.current) setAnalyser(analyserRef.current);
    } else {
      audio.pause();
      setAnalyser(null);
    }
    if (!analyserRef.current) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      setAnalyser(analyser);
      analyserRef.current = analyser;
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    }
  };

  return (
    <div
      style={{ height: 500, width: 500, background: "white" }}
      onClick={handleClick}>
      <AudioVisualizer analyser={analyser} maxSize={500} size={300} />
    </div>
  );
};
