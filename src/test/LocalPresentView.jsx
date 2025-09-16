import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";

const ScreenDrawCapture = () => {
  const videoRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [isCapturing, setIsCapturing] = useState(false);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#ff4757");
  const [strokeWidth, setStrokeWidth] = useState(4);

  const width = 960;
  const height = 540;

  // Capture d’écran
  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setIsCapturing(true);
    } catch (err) {
      console.error("Erreur de capture:", err);
    }
  };

  const stopCapture = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  // Dessin interactif
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y], color, strokeWidth }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setLines((prevLines) => {
      const lastLine = prevLines[prevLines.length - 1];
      const updatedLine = {
        ...lastLine,
        points: [...lastLine.points, point.x, point.y],
      };
      return [...prevLines.slice(0, -1), updatedLine];
    });
  };

  const handleMouseUp = () => setIsDrawing(false);
  const clearCanvas = () => setLines([]);

  // Composition vidéo + dessin dans canvas
  useEffect(() => {
    let frameId;

    const drawFrame = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const video = videoRef.current;

      ctx.clearRect(0, 0, width, height);

      if (video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, width, height);
      }

      // Dessin Konva dans le canvas
      const konvaCanvas = stageRef.current.toCanvas();
      ctx.drawImage(konvaCanvas, 0, 0);

      frameId = requestAnimationFrame(drawFrame);
    };

    if (isCapturing) {
      drawFrame();
    }

    return () => cancelAnimationFrame(frameId);
  }, [isCapturing, lines]);

  // Capture du flux combiné
  const getCombinedStream = () => {
    return canvasRef.current.captureStream(60);
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "100%" }}>
      <div
        style={{
          marginBottom: "12px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}>
        <button onClick={isCapturing ? stopCapture : startCapture}>
          {isCapturing ? "Arrêter la capture" : "Démarrer la capture"}
        </button>

        <label>
          Couleur
          <input
            type='color'
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>

        <label>
          Épaisseur
          <input
            type='range'
            min='1'
            max='20'
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          />
          {strokeWidth}px
        </label>

        <button onClick={clearCanvas}>Effacer le dessin</button>

        {isCapturing && (
          <button
            onClick={() => {
              const stream = getCombinedStream();
              console.log("Flux combiné prêt:", stream);
              // Tu peux l’utiliser avec MediaRecorder ou WebRTC ici
            }}>
            Obtenir le flux combiné
          </button>
        )}
      </div>

      <div
        style={{
          position: "relative",
          width,
          height,
          border: "1px solid #ccc",
        }}>
        <video ref={videoRef} style={{ display: "none" }} muted playsInline />

        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
        />

        <Stage
          ref={stageRef}
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}>
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                tension={0.4}
                lineCap='round'
                lineJoin='round'
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default ScreenDrawCapture;
