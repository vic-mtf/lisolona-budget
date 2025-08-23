import { noiseSuppressor } from "../utils/NoiseSuppressor";
import { Box } from "@mui/material";
import VolumeViewer from "./VolumeViewer";
import { useState } from "react";
import VideoBackgroundEffects from "./VideoBackgroundEffects";
import { useEffect } from "react";
import streamSegmenterMediaPipe from "../utils/StreamSegmenterMediaPipe";
import { useRef } from "react";
import { useCallback } from "react";

const App = () => {
  const [processedStream, setProcessedStream] = useState(null);

  const videoRef = useRef(null);
  const init = useCallback(async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    const processedStream = await streamSegmenterMediaPipe.initStream(
      mediaStream
    );
    setProcessedStream(processedStream);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && processedStream !== video?.srcObject)
      video.srcObject = processedStream;
  }, [processedStream]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2px",
          padding: "10px",
        }}>
        <button onClick={() => init()}>start streaming</button>
        <button
          onClick={() => {
            streamSegmenterMediaPipe.enableStyle("filter");
            streamSegmenterMediaPipe.setFilterType("grayscale");
          }}>
          Grayscale
        </button>

        <button onClick={() => streamSegmenterMediaPipe.enableStyle("blur")}>
          Blur
        </button>
        <button onClick={() => streamSegmenterMediaPipe.enableStyle("enhance")}>
          enhance
        </button>
        <button
          onClick={() =>
            streamSegmenterMediaPipe.enableStyle("replaceBackground")
          }>
          replace bg
        </button>
        <button onClick={() => streamSegmenterMediaPipe.resetStyles()}>
          disabled all styles
        </button>
      </div>

      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        style={{ transform: "scaleX(-1)" }}
        disablePictureInPicture
      />
    </div>
  );
};

export default App;
