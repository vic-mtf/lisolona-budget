import { noiseSuppressor } from "../utils/NoiseSuppressor";
import { Box } from "@mui/material";
import VolumeViewer from "./VolumeViewer";
import { useState } from "react";
import VideoBackgroundEffects from "./VideoBackgroundEffects";
import { useEffect } from "react";
import streamSegmenterMediaPipe from "../utils/StreamSegmenterMediaPipe";
import { useRef } from "react";

const App = () => {
  const [processedStream, setProcessedStream] = useState(null);

  const streamRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const stream = streamRef.current;
    const init = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const processedStream = await streamSegmenterMediaPipe.initStream(
        mediaStream
      );
      setProcessedStream(processedStream);
    };
    if (!stream) init();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && processedStream !== video?.srcObject)
      video.srcObject = processedStream;
  }, [processedStream]);

  return (
    <div style={{ position: "relative", height: "100vh", overflowY: "auto" }}>
      <video ref={videoRef} playsInline autoPlay muted />
    </div>
  );
};

export default App;
