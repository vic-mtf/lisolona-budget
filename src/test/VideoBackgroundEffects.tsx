import React, { useRef, useEffect, useState } from "react";
import { FilesetResolver, ImageSegmenter } from "@mediapipe/tasks-vision";

export default function VideoBackgroundEffects({ backgroundType = "blur" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const segmenterRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let running = true;

    const init = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );

      segmenterRef.current = await ImageSegmenter.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-tasks/image_segmenter/selfie_segmenter/float32/latest/selfie_segmenter.tflite",
          delegate: "GPU", // Peut être "CPU" pour tester
        },
        outputCategoryMask: true,
        runningMode: "VIDEO",
      });

      // Demande accès caméra
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setReady(true);
      requestAnimationFrame(renderFrame);
    };

    const convertMaskToImageData = async (mask) => {
      // Cas 1 : format CPU (Mask)
      if (typeof mask.getAsImageData === "function") {
        return mask.getAsImageData();
      }
      // Cas 2 : VideoFrame
      if (window.VideoFrame && mask instanceof VideoFrame) {
        const bitmap = await createImageBitmap(mask);
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = bitmap.width;
        tempCanvas.height = bitmap.height;
        const ctx = tempCanvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0);
        return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
      }
      // Cas 3 : ImageBitmap
      if (mask instanceof ImageBitmap) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = mask.width;
        tempCanvas.height = mask.height;
        const ctx = tempCanvas.getContext("2d");
        ctx.drawImage(mask, 0, 0);
        return ctx.getImageData(0, 0, mask.width, mask.height);
      }
      console.warn("Format de mask non géré :", mask);
      return null;
    };

    const renderFrame = async () => {
      if (!running || !videoRef.current || !segmenterRef.current) return;

      const now = performance.now();
      const result = await segmenterRef.current.segmentForVideo(
        videoRef.current,
        now
      );

      if (result?.categoryMask) {
        const maskImageData = await convertMaskToImageData(result.categoryMask);
        if (maskImageData) {
          drawOutput(maskImageData);
        }
      }

      requestAnimationFrame(renderFrame);
    };

    const drawOutput = (maskImageData) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Dessine le fond
      if (backgroundType === "blur") {
        ctx.filter = "blur(8px)";
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        ctx.filter = "none";
      } else if (backgroundType === "image") {
        const bg = new Image();
        bg.src = "/bg.jpg"; // Ton image de fond
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      }

      // Dessine la personne par-dessus (selon le masque)
      const personCanvas = document.createElement("canvas");
      personCanvas.width = maskImageData.width;
      personCanvas.height = maskImageData.height;
      const personCtx = personCanvas.getContext("2d");
      personCtx.drawImage(videoRef.current, 0, 0);
      const personData = personCtx.getImageData(
        0,
        0,
        personCanvas.width,
        personCanvas.height
      );

      for (let i = 0; i < maskImageData.data.length; i += 4) {
        const alpha = maskImageData.data[i] > 128 ? 255 : 0;
        personData.data[i + 3] = alpha;
      }
      personCtx.putImageData(personData, 0, 0);
      ctx.drawImage(personCanvas, 0, 0, canvas.width, canvas.height);
    };

    init();

    return () => {
      running = false;
    };
  }, [backgroundType]);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} playsInline muted />
      <canvas ref={canvasRef} />
    </div>
  );
}
