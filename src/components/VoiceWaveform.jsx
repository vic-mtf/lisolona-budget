import React, {
  useLayoutEffect,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { useTheme, Box } from "@mui/material";
import PropTypes from "prop-types";
import useElementSize from "../hooks/useElementSize";

const VoiceWaveform = ({
  audioFileOrBuffer,
  currentTime,
  barWidth = 4,
  gap = 4,
  barHeightRatio = 0.8,
  barRadius = 2,
  width = 400,
  height = 50,
  minBarHeight = 4,
  amplitudeThreshold = 0,
  onGetDuration,
  onGetRawData,
  rawData: rd,
}) => {
  const [rawData, setRawData] = useState(rd || []);
  const [duration, setDuration] = useState(0);
  const canvasRef = useRef(null);
  const theme = useTheme();

  const barSpacing = barWidth + gap;

  const waveformData = useMemo(() => {
    const filtered = [];
    if (rawData.length > 0) {
      const visibleBars = Math.floor(width / barSpacing);
      const blockSize = Math.floor(rawData.length / visibleBars);

      for (let i = 0; i < visibleBars; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          const index = i * blockSize + j;
          sum += Math.abs(rawData[index] || 0);
        }
        const average = sum / blockSize;

        const softwareGain = 5;
        const amplified = Math.min(average * softwareGain, 1);
        const normalized = Math.pow(amplified, 0.8);
        const isSignificant = normalized >= amplitudeThreshold;
        const rawHeight = isSignificant
          ? normalized * height * barHeightRatio
          : minBarHeight;

        filtered.push(Math.max(rawHeight, minBarHeight));
      }
    }
    return filtered;
  }, [
    rawData,
    width,
    height,
    amplitudeThreshold,
    barHeightRatio,
    minBarHeight,
    barSpacing,
  ]);

  const readRatio = useMemo(
    () => (duration > 0 ? currentTime / duration : 0),
    [currentTime, duration]
  );

  const readIndex = useMemo(
    () => Math.floor(readRatio * waveformData.length),
    [readRatio, waveformData.length]
  );

  useLayoutEffect(() => {
    const decodeAndSet = async (arrayBuffer) => {
      try {
        const audioCtx = new (window.AudioContext ||
          window.webkitAudioContext)();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        if (typeof onGetDuration === "function")
          onGetDuration(audioBuffer.duration);
        setDuration(audioBuffer.duration);
        const rawData = audioBuffer.getChannelData(0);
        setRawData(rawData);
        if (typeof onGetRawData === "function") onGetRawData(rawData);
      } catch (e) {
        console.error("Erreur décodage audio :", e);
      }
    };

    const loadAudio = async () => {
      if (!audioFileOrBuffer) return;

      if (
        audioFileOrBuffer instanceof File ||
        audioFileOrBuffer instanceof Blob
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result instanceof ArrayBuffer) {
            decodeAndSet(reader.result);
          }
        };
        reader.readAsArrayBuffer(audioFileOrBuffer);
      } else if (audioFileOrBuffer instanceof ArrayBuffer) {
        decodeAndSet(audioFileOrBuffer);
      } else {
        console.warn("Format audio non pris en charge");
      }
    };
    if (!Array.isArray(rd)) loadAudio();
  }, [audioFileOrBuffer, onGetDuration, rd, onGetRawData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData.length) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);

    waveformData.forEach((barHeight, i) => {
      const x = i * barSpacing;
      const y = (height - barHeight) / 2;
      const color =
        i <= readIndex
          ? theme.palette.primary.main
          : theme.palette.grey["A400"];

      ctx.fillStyle = color;

      if (barRadius > 0) {
        const r = Math.min(barRadius, barWidth / 2, barHeight / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + barWidth - r, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + r);
        ctx.lineTo(x + barWidth, y + barHeight - r);
        ctx.quadraticCurveTo(
          x + barWidth,
          y + barHeight,
          x + barWidth - r,
          y + barHeight
        );
        ctx.lineTo(x + r, y + barHeight);
        ctx.quadraticCurveTo(x, y + barHeight, x, y + barHeight - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    });
  }, [
    waveformData,
    readIndex,
    width,
    height,
    barSpacing,
    barWidth,
    barRadius,
    theme,
  ]);

  return (
    <Box width={width} height={height}>
      <canvas ref={canvasRef} width={width} height={height} />
    </Box>
  );
};

const VoiceWaveformWrapper = React.forwardRef((props, ref) => {
  const [parentRef, size] = useElementSize();
  return (
    <Box
      ref={parentRef}
      minHeight={50}
      sx={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
      }}>
      <VoiceWaveform {...props} {...size} ref={ref} />
    </Box>
  );
});

VoiceWaveform.propTypes = {
  audioFileOrBuffer: PropTypes.oneOfType([
    PropTypes.instanceOf(File),
    PropTypes.instanceOf(ArrayBuffer),
    PropTypes.instanceOf(Blob),
  ]),
  currentTime: PropTypes.number,
  barWidth: PropTypes.number,
  gap: PropTypes.number,
  barHeightRatio: PropTypes.number,
  barRadius: PropTypes.number,
  minBarHeight: PropTypes.number,
  amplitudeThreshold: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  onGetRawData: PropTypes.func,
  onGetDuration: PropTypes.func,
};

VoiceWaveformWrapper.displayName = "VoiceWaveform";
VoiceWaveformWrapper.propTypes = VoiceWaveform.propTypes;

export default VoiceWaveformWrapper;
