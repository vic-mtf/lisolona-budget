import React, { useEffect, useRef /*, useState*/ } from "react";
import { useTheme, Box } from "@mui/material";
import PropTypes from "prop-types";
import useElementSize from "../hooks/useElementSize";

const LiveWaveformRecorder = ({
  barWidth = 4,
  gap = 4,
  barHeightRatio = 1,
  barRadius = 2,
  height = 60,
  width = 400,
  amplitudeThreshold = 0.1,
  minBarHeight = 4,
  noiseFloor = 20,
  softwareGain = 2,
  speed = 10,
  stream,
  paused = false,
}) => {
  const canvasRef = useRef(null);
  // const [bars, setBars] = useState([]);
  const barsRef = useRef([]);
  const animationRef = useRef(null);
  const offsetRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());
  const theme = useTheme();

  useEffect(() => {
    let audioCtx;
    let analyser;
    let dataArray;
    let bufferLength;
    let source;
    let currentBars = [];

    const barSpacing = barWidth + gap;
    const pixelsPerSecond = speed * barSpacing;
    let isRunning = false;

    const initAudio = () => {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      source.connect(analyser);
    };

    const update = () => {
      if (!isRunning || paused) return;

      const now = performance.now();
      const deltaTime = (now - lastFrameTimeRef.current) / 1000;
      const deltaX = deltaTime * pixelsPerSecond;
      offsetRef.current -= deltaX;

      while (offsetRef.current <= -barSpacing) {
        offsetRef.current += barSpacing;

        analyser.getByteFrequencyData(dataArray);
        const avgAmplitude =
          dataArray.reduce((sum, val) => sum + val, 0) / bufferLength;

        const amplifiedAmplitude = Math.min(avgAmplitude * softwareGain, 255);
        const adjustedAmplitude = Math.max(amplifiedAmplitude - noiseFloor, 0);
        const normalized = Math.pow(
          adjustedAmplitude / (255 - noiseFloor),
          0.8
        );

        const isSignificant = normalized >= amplitudeThreshold;
        const rawHeight = isSignificant
          ? normalized * height * barHeightRatio
          : minBarHeight;

        const barHeight = Math.max(rawHeight, minBarHeight);
        currentBars.unshift(barHeight);
      }

      const maxVisibleBars = Math.ceil(width / barSpacing) + 2;
      if (currentBars.length > maxVisibleBars) {
        currentBars = currentBars.slice(0, maxVisibleBars);
      }

      barsRef.current = [...currentBars];
      // setBars(barsRef.current);
      drawBars();

      lastFrameTimeRef.current = now;
      animationRef.current = requestAnimationFrame(update);
    };

    const drawBars = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      const offset = offsetRef.current;

      barsRef.current.forEach((barHeight, i) => {
        const x = width - i * barSpacing + offset;
        const y = (height - barHeight) / 2;
        const fillColor = theme.palette.grey["A400"];
        ctx.fillStyle = fillColor;

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
    };

    if (stream) {
      initAudio();
      currentBars = barsRef.current;

      if (!paused) {
        isRunning = true;
        lastFrameTimeRef.current = performance.now();
        animationRef.current = requestAnimationFrame(update);
      }
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      audioCtx?.close();
      isRunning = false;
    };
  }, [
    barWidth,
    gap,
    height,
    barHeightRatio,
    amplitudeThreshold,
    minBarHeight,
    noiseFloor,
    softwareGain,
    speed,
    stream,
    width,
    paused,
    theme,
    barRadius,
  ]);

  // Gère les pauses
  useEffect(() => {
    if (!paused && animationRef.current === null) {
      lastFrameTimeRef.current = performance.now();
      const tick = () => {
        if (paused) {
          animationRef.current = null;
          return;
        }
        animationRef.current = requestAnimationFrame(tick);
      };
      animationRef.current = requestAnimationFrame(tick);
    } else if (paused && animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [paused]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

LiveWaveformRecorder.propTypes = {
  barWidth: PropTypes.number,
  gap: PropTypes.number,
  barHeightRatio: PropTypes.number,
  barRadius: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  amplitudeThreshold: PropTypes.number,
  speed: PropTypes.number,
  stream: PropTypes.instanceOf(MediaStream),
  paused: PropTypes.bool,
  minBarHeight: PropTypes.number,
  noiseFloor: PropTypes.number,
  softwareGain: PropTypes.number,
};

const LiveWaveformRecorderWrapper = (props) => {
  const [parentRef, size] = useElementSize();
  return (
    <Box
      overflow='hidden'
      position='relative'
      display='flex'
      justifyContent='center'
      height={50}
      flexGrow={1}
      ref={parentRef}
      alignItems='center'>
      <LiveWaveformRecorder {...props} {...size} />
    </Box>
  );
};

LiveWaveformRecorderWrapper.displayName = "LiveWaveformRecorder";
LiveWaveformRecorderWrapper.propTypes = LiveWaveformRecorder.propTypes;

export default React.memo(LiveWaveformRecorderWrapper);
