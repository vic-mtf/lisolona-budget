import logoSrcWhite from "../assets/geid_logo_white_without_title.webp";
import logoSrcBlue from "../assets/geid_logo_blue_without_title.webp";
export default async function generateSVGImage({
  svgElement,
  title,
  description,
  theme,
}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = 1080;
  const height = 1920;
  canvas.width = width;
  canvas.height = height;

  // 🟦 Fond
  ctx.fillStyle = theme.palette.background.default || "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // 🖼️ Logo GEID
  const logoImg = await loadImage(
    theme?.palette?.mode === "light" ? logoSrcBlue : logoSrcWhite
  );

  const logoHeight = 80;
  const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
  const logoX = 50;
  const logoY = 40;
  ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

  // 📏 Centrage vertical : ligne de base pour tous les éléments
  const centerY = logoY + logoHeight / 2;

  // 🟫 Barre verticale (plus haute que le texte)
  const barHeight = logoHeight * 1.2;
  const barWidth = 4;
  const barX = logoX + logoWidth + 20;
  const barY = centerY - barHeight / 2;
  ctx.fillStyle = theme.palette.text.primary || "#000";
  ctx.fillRect(barX, barY, barWidth, barHeight);

  // 🟨 Texte "Lisolo" centré à droite de la barre
  const lisoloFontSize = logoHeight * 0.8;
  ctx.font = `${lisoloFontSize}px ${theme.typography.fontFamily || "Arial"}`;
  ctx.textAlign = "left";
  ctx.fillStyle = theme.palette.text.primary || "#000";

  const textX = barX + barWidth + 16;
  const textY = centerY + lisoloFontSize * 0.35; // aligné avec le logo
  ctx.fillText("Lisolo", textX, textY);
  // 🧾 Charger le SVG
  const svgString = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const drawingImg = await loadImage(url);

  // 🔳 Zone du dessin (centrée)
  const qrSize = Math.min(width * 0.6, height * 0.4);
  const qrX = (width - qrSize) / 2;
  const qrY = height / 2 - qrSize / 2;
  const qrMargin = 60;

  const titleY = qrY - qrMargin;
  const descY = qrY + qrSize + qrMargin;

  // 🖋️ Titre au-dessus du SVG
  drawWrappedText({
    ctx,
    text: title,
    x: width / 2,
    y: titleY,
    maxWidth: width - 160,
    fontFamily: theme.typography.fontFamily || "Arial",
    fontSize: 52,
    minFontSize: 24,
    lineHeight: 56,
    textAlign: "center",
    color: theme.palette.text.primary || "#000",
    verticalDirection: "up",
    maxHeight: qrY - 160,
  });

  // 📝 Description sous le SVG
  drawWrappedText({
    ctx,
    text: description,
    x: width / 2,
    y: descY,
    maxWidth: width - 160,
    fontFamily: theme.typography.fontFamily || "Arial",
    fontSize: 36,
    minFontSize: 18,
    lineHeight: 42,
    textAlign: "center",
    color: theme.palette.text.secondary || "#555",
    verticalDirection: "down",
    maxHeight: height - descY - 100,
  });

  // 🔲 Dessin SVG avec coins arrondis
  const radius = 40;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(qrX + radius, qrY);
  ctx.lineTo(qrX + qrSize - radius, qrY);
  ctx.quadraticCurveTo(qrX + qrSize, qrY, qrX + qrSize, qrY + radius);
  ctx.lineTo(qrX + qrSize, qrY + qrSize - radius);
  ctx.quadraticCurveTo(
    qrX + qrSize,
    qrY + qrSize,
    qrX + qrSize - radius,
    qrY + qrSize
  );
  ctx.lineTo(qrX + radius, qrY + qrSize);
  ctx.quadraticCurveTo(qrX, qrY + qrSize, qrX, qrY + qrSize - radius);
  ctx.lineTo(qrX, qrY + radius);
  ctx.quadraticCurveTo(qrX, qrY, qrX + radius, qrY);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(drawingImg, qrX, qrY, qrSize, qrSize);
  ctx.restore();

  return canvas.toDataURL("image/png");
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawWrappedText({
  ctx,
  text,
  x,
  y,
  maxWidth,
  fontSize,
  minFontSize,
  lineHeight,
  fontFamily,
  textAlign,
  color,
  verticalDirection = "down",
  maxHeight = Infinity,
}) {
  ctx.textAlign = textAlign;
  ctx.fillStyle = color;

  while (fontSize >= minFontSize) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    const words = text.split(" ");
    const lines = [];
    let line = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    const totalHeight = lines.length * lineHeight;
    if (totalHeight <= maxHeight) {
      lines.forEach((lineText, i) => {
        const yOffset =
          verticalDirection === "up"
            ? y - (lines.length - 1 - i) * lineHeight
            : y + i * lineHeight;
        ctx.fillText(lineText, x, yOffset);
      });
      break;
    }

    fontSize -= 2;
  }
}
