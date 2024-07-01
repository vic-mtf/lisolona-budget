import React, { useRef } from "react";
import { useEffect } from "react";

export const AudioVisualizer = React.memo(
  ({ analyser, audioTrack, size, maxSize, radius, color }) => {
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
        if (audioTrack?.getVolumeLevel) volume = audioTrack?.getVolumeLevel();
        const rectSize = getValue(maxSize, size, volume);
        const rectCoord = (maxSize - rectSize) / 2;
        rect.setAttribute("width", rectSize);
        rect.setAttribute("height", rectSize);
        rect.setAttribute("x", rectCoord);
        rect.setAttribute("y", rectCoord);
        //rect.setAttribute('fill', color);
        rect.setAttribute("stroke", color);
        if (volume) rect.style.transition = "all  .2s";
      }
      if (audioTrack || analyser) renderFrame();
      else window.cancelAnimationFrame(requestAnimationFrameRef.current);
      return () => {
        window.cancelAnimationFrame(requestAnimationFrameRef.current);
      };
    }, [analyser, size, maxSize, audioTrack, color]);

    return (
      <svg
        height={maxSize}
        width={maxSize}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: maxSize,
          width: maxSize,
          // opacity: .5,
        }}>
        <rect rx={radius} ref={recRef} strokeWidth={2} fill='transparent' />
      </svg>
    );
  }
);

AudioVisualizer.defaultProps = {
  size: 200,
  maxSize: 300,
  radius: 10,
};

function getValue(max, min, percentage) {
  return min + (max - min) * percentage;
}

function hslStringToRgba(hslString, a) {
  // Parse HSL values from string
  const [hStr, sStr, lStr] = hslString
    .substring(4, hslString.length - 1)
    .split(",");
  const h = parseInt(hStr);
  const s = parseFloat(sStr) / 100;
  const l = parseFloat(lStr) / 100;

  // Convert HSL to RGB
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert RGB to RGBA with opacity
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
    b * 255
  )}, ${a})`;
}

export default AudioVisualizer;
