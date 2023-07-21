import React, { useRef, useEffect } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function loadAndPredict() {
      // Définit le backend WebGL pour TensorFlow.js
      await tf.setBackend('webgl');

      // Charge le modèle BodyPix
      const model = await bodyPix.load();

      // Récupère les éléments Video et Canvas et leur contexte 2D
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Demande l'accès à la webcam de l'utilisateur
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;

      // Attend que la vidéo soit prête
      await new Promise(resolve => {
        video.onloadedmetadata = () => {
          resolve();
        };
      });

      // Démarre la lecture de la vidéo
      video.play();

      // Boucle de prédiction
      async function predict() {
        // Dessine l'image actuelle de la vidéo sur le Canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Crée une copie de l'image actuelle du Canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Segment la personne dans l'image
        const segmentation = await model.segmentPerson(canvas);

        // Remplace l'arrière-plan par du bleu
        for (let y = 0; y < segmentation.height; y++) {
          for (let x = 0; x < segmentation.width; x++) {
            const index = y * segmentation.width + x;
            if (segmentation.data[index] === 0) {
              const i = (y * imageData.width + x) * 4;
              imageData.data[i] = 0;
              imageData.data[i + 1] = 0;
              imageData.data[i + 2] = 255;
            }
          }
        }

        // Dessine l'image avec l'arrière-plan bleu sur le Canvas
        ctx.putImageData(imageData, 0, 0);

        // Planifie la prochaine prédiction
        requestAnimationFrame(predict);
      }

      // Démarre la boucle de prédiction
      predict();
    }

    loadAndPredict();
  }, []);

  return (
    <div>
      <video ref={videoRef} width={640} height={480} hidden />
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
}

export default App;
