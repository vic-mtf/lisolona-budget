import tinycolor from "tinycolor2";
import generateBackgroundFromImage from "./generateBackgroundFromImage";

const defaultArgs = {
  width: window.innerWidth,
  height: window.innerHeight,
  id: undefined,
  theme: "light",
};

export default async function generateBackgroundFromId(args = defaultArgs) {
  const { id, width, height, theme } = { ...defaultArgs, ...args };
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const timestamp = parseInt(id.toString().substring(0, 8), 16);
  const machineId = parseInt(id.toString().substring(8, 14), 16);
  const numColors = Math.floor(machineId / 10000) + 2;
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = ((i * 360) / numColors + (timestamp % 360)) % 360;
    colors.push(`hsl(${hue}, 80%, 50%)`);
  }

  const gradients = colors.map((color) => {
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(
      1,
      `rgba(${tinycolor(color)
        .toRgbString()
        .replace(/[rgb\(\)]/gi, "")}, 0)`
    );
    return gradient;
  });
  const rectangleWidth = canvas.width / gradients.length;
  const rectangleHeight = canvas.height;
  for (let i = 0; i < gradients.length; i++) {
    ctx.fillStyle = gradients[i];
    ctx.fillRect(i * rectangleWidth, 0, rectangleWidth, rectangleHeight);
  }
  const url = canvas.toDataURL();
  return generateBackgroundFromImage({ url, height, width, theme });
}
