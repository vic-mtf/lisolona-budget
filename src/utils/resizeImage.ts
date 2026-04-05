const defaultProps = {
  url: null,
  maxWidth: null,
  maxHeight: null,
  quality: 1,
  scale: 1,
  multiQuality: false,
  imageSmoothingQuality: null,
};
export default function resizeImage(props = defaultProps) {
  const {
    url,
    maxWidth: mW,
    maxHeight: mH,
    quality,
    scale,
    imageSmoothingQuality,
    multiQuality,
  } = { ...defaultProps, ...props };
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.src = url;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        let maxWidth = (typeof mW === "number" ? mW : width) * scale;
        let maxHeight = (typeof mH === "number" ? mH : height) * scale;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        if (imageSmoothingQuality)
          ctx.imageSmoothingQuality = imageSmoothingQuality;
        const normal = canvas.toDataURL("image/webp", quality);
        let high = null;
        let medium = null;
        let low = null;
        if (multiQuality) {
          ctx.imageSmoothingQuality = "low";
          low = canvas.toDataURL("image/webp", quality);
          ctx.imageSmoothingQuality = "medium";
          medium = canvas.toDataURL("image/webp", quality);
          ctx.imageSmoothingQuality = "high";
          high = canvas.toDataURL("image/webp", quality);
        }
        resolve({ normal, high, medium, low });
      };
    } catch (error) {
      reject(error);
    }
  });
}
