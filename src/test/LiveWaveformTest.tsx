import React, { useState, useRef } from "react";
import { Box, Button, Typography, Paper, Slider } from "@mui/material";
import LiveWaveformRecorder from "../components/LiveWaveformRecorder";

const LiveWaveformTest = () => {
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [amplitudeThreshold, setAmplitudeThreshold] = useState(0.1);
  const [barHeightRatio, setBarHeightRatio] = useState(1);
  const [speed, setSpeed] = useState(60);
  const audioStreamRef = useRef(null);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      audioStreamRef.current = mediaStream;
      setStream(mediaStream);
      setRecording(true);
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error);
      alert("Impossible d'accéder au microphone. Vérifiez les permissions.");
    }
  };

  const stopRecording = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      setStream(null);
      setRecording(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant='h4' gutterBottom>
        🎤 Test LiveWaveformRecorder Amélioré
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant='h6' gutterBottom>
          Contrôles d'enregistrement
        </Typography>

        {!recording ? (
          <Button
            variant='contained'
            color='primary'
            onClick={startRecording}
            size='large'>
            🎙️ Démarrer l'enregistrement
          </Button>
        ) : (
          <Button
            variant='contained'
            color='error'
            onClick={stopRecording}
            size='large'>
            ⏹️ Arrêter l'enregistrement
          </Button>
        )}
      </Paper>

      {recording && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant='h6' gutterBottom>
            Visualisation en temps réel
          </Typography>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            Analyse des fréquences vocales avec mouvement fluide
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 100,
              backgroundColor: "background.default",
              borderRadius: 1,
              p: 2,
            }}>
            <LiveWaveformRecorder
              stream={stream}
              width={600}
              height={80}
              barWidth={3}
              gap={2}
              barHeightRatio={barHeightRatio}
              amplitudeThreshold={amplitudeThreshold}
              speed={speed}
              maxBars={150}
            />
          </Box>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant='h6' gutterBottom>
          Paramètres de visualisation
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Seuil d'amplitude: {amplitudeThreshold.toFixed(2)}
          </Typography>
          <Slider
            value={amplitudeThreshold}
            onChange={(_, value) => setAmplitudeThreshold(value)}
            min={0}
            max={0.5}
            step={0.01}
            valueLabelDisplay='auto'
          />
          <Typography variant='caption' color='text.secondary'>
            Ajuste la sensibilité de détection vocale
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Ratio de hauteur: {barHeightRatio.toFixed(1)}
          </Typography>
          <Slider
            value={barHeightRatio}
            onChange={(_, value) => setBarHeightRatio(value)}
            min={0.5}
            max={2}
            step={0.1}
            valueLabelDisplay='auto'
          />
          <Typography variant='caption' color='text.secondary'>
            Contrôle la hauteur maximale des barres
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Vitesse d'animation: {speed} FPS</Typography>
          <Slider
            value={speed}
            onChange={(_, value) => setSpeed(value)}
            min={30}
            max={120}
            step={10}
            valueLabelDisplay='auto'
          />
          <Typography variant='caption' color='text.secondary'>
            Fluidité du mouvement (plus élevé = plus fluide)
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant='h6' gutterBottom>
          🎯 Améliorations apportées
        </Typography>
        <Typography component='div'>
          <ul>
            <li>
              <strong>Analyse fréquentielle avancée</strong> : Séparation en
              bandes de fréquences (graves, médiums, aigus) optimisées pour la
              voix humaine
            </li>
            <li>
              <strong>Mouvement fluide</strong> : Animation continue avec
              interpolation au lieu de sauts discrets
            </li>
            <li>
              <strong>Synthèse pondérée</strong> : Privilégie les fréquences
              médiums (1-3kHz) importantes pour la compréhension vocale
            </li>
            <li>
              <strong>Gradient visuel</strong> : Utilise les couleurs du thème
              Material-UI pour un rendu plus élégant
            </li>
            <li>
              <strong>Optimisation performance</strong> : Gestion séparée de
              l'ajout de barres et de l'animation
            </li>
          </ul>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LiveWaveformTest;
