const defaultArgs = {
  theme: "light",
  width: window.innerWidth,
  height: window.innerHeight,
};

export default async function generateBackgroundFromImage(args = defaultArgs) {
  const { url, width, height, theme } = { ...defaultArgs, ...args };
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      return new Promise((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          const imageData = ctx.getImageData(0, 0, width, height);

          // Appliquer un flou gaussien à l'image
          const filter = new BlurFilter(10);
          filter.apply(imageData);

          // Ajouter une opacité de 0,5 à l'image
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            data[i + 3] *= 0.5;
          }

          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL());
        };

        img.onerror = reject;
      });
    });
}

class BlurFilter {
  constructor() {
    this.matrix = [
      1 / 16,
      2 / 16,
      1 / 16,
      2 / 16,
      4 / 16,
      2 / 16,
      1 / 16,
      2 / 16,
      1 / 16,
    ];
    this.offset = 127.5;
  }

  apply(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    const tempData = new Uint8ClampedArray(data.length);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let r = 0;
        let g = 0;
        let b = 0;

        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            const index = ((y + j) * width + (x + i)) * 4;
            const weight = this.matrix[(j + 1) * 3 + (i + 1)];

            r += data[index] * weight;
            g += data[index + 1] * weight;
            b += data[index + 2] * weight;
          }
        }

        const index = (y * width + x) * 4;

        tempData[index] = r + this.offset;
        tempData[index + 1] = g + this.offset;
        tempData[index + 2] = b + this.offset;
        tempData[index + 3] = data[index + 3];
      }
    }

    for (let i = 0; i < data.length; i++) {
      data[i] = tempData[i];
    }
  }
}
