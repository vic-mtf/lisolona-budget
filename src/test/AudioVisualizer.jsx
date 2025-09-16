import React, { useRef, useEffect, useState, useCallback } from "react";

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const wavesRef = useRef([]);
  const smoothedLevelRef = useRef(0); // niveau audio interpolé

  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Configuration des ondes
  const WAVE_CONFIG = {
    maxRadius: 400,
    propagationSpeed: 3,
    fadeSpeed: 0.015,
    minOpacity: 0.1,
    maxOpacity: 0.9,
    strokeWidth: 3,
    colors: ["#3B82F6", "#06B6D4", "#8B5CF6", "#EF4444", "#10B981", "#F59E0B"],
  };

  // Classe pour gérer une onde individuelle
  class Wave {
    constructor(x, y, intensity = 1) {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.opacity = WAVE_CONFIG.maxOpacity * intensity;
      this.intensity = intensity;
      this.color =
        WAVE_CONFIG.colors[
          Math.floor(Math.random() * WAVE_CONFIG.colors.length)
        ];
      this.active = true;
    }

    update() {
      this.radius += WAVE_CONFIG.propagationSpeed * this.intensity * 0.7; // plus fluide
      this.opacity -= WAVE_CONFIG.fadeSpeed * 0.7; // plus doux
      if (this.opacity <= 0 || this.radius > WAVE_CONFIG.maxRadius) {
        this.active = false;
      }
    }

    draw(ctx) {
      if (!this.active) return;
      ctx.save();
      ctx.globalAlpha = Math.max(this.opacity, 0);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = WAVE_CONFIG.strokeWidth;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      setIsRecording(true);
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error);
      alert("Impossible d'accéder au microphone. Veuillez autoriser l'accès.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setIsRecording(false);
    setAudioLevel(0);
    wavesRef.current = [];
    smoothedLevelRef.current = 0;
  }, []);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return 0;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteTimeDomainData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }

    const rms = Math.sqrt(sum / bufferLength);
    const amplified = rms * 10;
    const level = Math.min(amplified * amplified * 2, 1);

    return level;
  }, []);

  const createWave = useCallback((centerX, centerY, intensity) => {
    if (intensity > 0.01) {
      wavesRef.current.push(
        new Wave(centerX, centerY, Math.max(intensity, 0.3))
      );
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let currentLevel = 0;
    if (isRecording && analyserRef.current) {
      currentLevel = analyzeAudio();
    }

    // Interpolation douce
    const smoothing = 0.08;
    smoothedLevelRef.current +=
      (currentLevel - smoothedLevelRef.current) * smoothing;
    const level = smoothedLevelRef.current;
    setAudioLevel(level);

    // Créer des ondes
    if (level > 0.01 && Math.random() < Math.max(level * 2, 0.3)) {
      createWave(centerX, centerY, Math.max(level * 3, 0.5));
    }

    // Mettre à jour et dessiner les ondes
    wavesRef.current = wavesRef.current.filter((wave) => {
      wave.update();
      wave.draw(ctx);
      return wave.active;
    });

    // Avatar et glow
    const baseRadius = 60;
    const avatarRadius = baseRadius + level * 30;
    const glowRadius = avatarRadius + level * 40;

    if (level > 0.01) {
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        avatarRadius,
        centerX,
        centerY,
        glowRadius
      );
      gradient.addColorStop(0, `rgba(59, 130, 246, ${level * 0.6})`);
      gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.save();
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.strokeStyle = isRecording ? "#EF4444" : "#3B82F6";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, avatarRadius + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    const avatarGradient = ctx.createRadialGradient(
      centerX - 20,
      centerY - 20,
      0,
      centerX,
      centerY,
      avatarRadius
    );
    avatarGradient.addColorStop(0, "#60A5FA");
    avatarGradient.addColorStop(1, "#1E40AF");

    ctx.save();
    ctx.fillStyle = avatarGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, avatarRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const iconSize = Math.max(24, level * 40 + 20);
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = `${iconSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.fillText("🎤", centerX, centerY);
    ctx.restore();

    animationRef.current = requestAnimationFrame(animate);
  }, [isRecording, analyzeAudio, createWave]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  useEffect(() => {
    return () => {
      stopRecording();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [stopRecording]);

  const handleToggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#0F172A",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}>
        <button
          onClick={handleToggleRecording}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isRecording ? "#EF4444" : "#3B82F6",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: `0 4px 20px ${
              isRecording ? "#EF444480" : "#3B82F680"
            }, 0 0 ${audioLevel * 30}px ${isRecording ? "#EF4444" : "#3B82F6"}`,
            outline: "none",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = isRecording
              ? "#DC2626"
              : "#2563EB";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = isRecording
              ? "#EF4444"
              : "#3B82F6";
            e.target.style.transform = "scale(1)";
          }}>
          {isRecording ? "⏹️" : "🎤"}
        </button>
      </div>
    </div>
  );
};

export default AudioVisualizer;
