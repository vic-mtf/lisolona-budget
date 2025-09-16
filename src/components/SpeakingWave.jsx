import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const parseColorToRgba = (color, alpha = 1) => {
  if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    let hex = color.substring(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (/^rgb\(/i.test(color))
    return color.replace(/rgb/i, "rgba").replace(")", `, ${alpha})`);

  if (/^hsl\(/i.test(color))
    return color.replace(/hsl/i, "hsla").replace(")", `, ${alpha})`);

  return color;
};

const SpeakingWave = ({ volume, color = "#3498db" }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pulsesRef = useRef([]);
  const lastPulseRef = useRef(0);

  useEffect(() => {
    const now = performance.now();
    const COOLDOWN = 150; // ms entre pulses
    const MIN_VOLUME = 15;

    if (volume > MIN_VOLUME && now - lastPulseRef.current > COOLDOWN) {
      pulsesRef.current.push({
        radius: 0,
        alpha: Math.min(0.8, volume / 100), // alpha proportionnel au volume
        strength: Math.max(1, volume / 20), // vitesse proportionnelle au volume
        lineWidth: 1 + volume / 50, // épaisseur variable
      });
      lastPulseRef.current = now;
    }
  }, [volume]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrame;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;
      const avatarRadius = Math.min(w, h) / 50;

      // Dessin de l'avatar
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, avatarRadius, 0, Math.PI * 2);
      ctx.fill();

      // Mise à jour et dessin des pulses
      pulsesRef.current = pulsesRef.current.filter((pulse) => {
        pulse.radius += 1 + pulse.strength;
        pulse.alpha *= 0.95;

        if (pulse.alpha > 0.01) {
          ctx.strokeStyle = parseColorToRgba(color, pulse.alpha);
          ctx.lineWidth = pulse.lineWidth;
          ctx.beginPath();
          ctx.arc(
            centerX,
            centerY,
            avatarRadius + pulse.radius,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          return true;
        }
        return false;
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [color]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
};

SpeakingWave.propTypes = {
  volume: PropTypes.number,
  color: PropTypes.string, // HEX, RGB, HSL supportés
};

export default SpeakingWave;
