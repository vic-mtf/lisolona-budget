import * as bodySegmentation from "@tensorflow-models/body-segmentation";

const createSegmenter = async () => {
  const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
  const config = {
    runtime: "mediapipe",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
    modelType: "general",
    maxNumPeople: 1,
    segmentationThreshold: 0.7,
    outputCategoryMask: true,
    outputConfidenceMasks: true,
  };
  return bodySegmentation.createSegmenter(model, config);
};

class StreamSegmenter {
  #video;
  #canvas;
  #context;
  #finalCanvas;
  #finalContext;
  #segmenter;
  #animationId;
  #readyCallback;
  #backgroundImage;
  #activeStyles = new Set();
  #filterType = "grayscale";
  #resolution = {
    width: 0,
    height: 0,
  };
  #blurConfig = {
    foregroundThreshold: 0.7,
    blurAmount: 5,
    edgeBlurAmount: 20,
    flipHorizontal: false,
  };
  #enhanceConfig = {
    brightness: 20,
    contrast: 1.2,
    gamma: 1.0,
  };
  isReady = false;

  constructor() {
    this.#canvas = document.createElement("canvas");
    this.#video = document.createElement("video");
    this.#finalCanvas = document.createElement("canvas");
    this.#video.autoplay = true;
    this.#video.playsInline = true;
    this.#video.muted = true;
    this.#context = this.#canvas.getContext("2d", { willReadFrequently: true });
    this.#finalContext = this.#finalCanvas.getContext("2d", {
      willReadFrequently: true,
    });
  }

  async #getSegmenter() {
    if (!this.#segmenter) this.#segmenter = await createSegmenter();
    return this.#segmenter;
  }

  async initStream(stream) {
    this.#video.srcObject = stream;

    const processedStream = await new Promise((resolve) => {
      this.#video.onloadedmetadata = () => {
        this.#canvas.width = this.#video.videoWidth;
        this.#canvas.height = this.#video.videoHeight;

        this.#resolution.width = this.#video.videoWidth;
        this.#resolution.height = this.#video.videoHeight;

        this.#finalCanvas.width = this.#resolution.width;
        this.#finalCanvas.height = this.#resolution.height;
        this.isReady = true;
        if (typeof this.#readyCallback === "function")
          this.#readyCallback(this.getProcessedStream());
        resolve(this.getProcessedStream());
      };
    });
    await this.#video.play();
    this.#startRenderLoop();
    return processedStream;
  }

  onReady(callback) {
    this.#readyCallback = callback;
    if (this.isReady && typeof callback === "function")
      callback(this.getProcessedStream());
  }

  getOriginalStream() {
    return this.#video.srcObject;
  }

  getProcessedStream() {
    return this.#finalCanvas.captureStream();
  }

  #startRenderLoop() {
    const loop = async () => {
      const styles = this.#activeStyles;
      this.#context.drawImage(
        this.#video,
        0,
        0,
        this.#canvas.width,
        this.#canvas.height
      );

      if (styles.size > 0) {
        let segmenter;
        let segmentation;

        if (
          styles.has("blur") ||
          styles.has("removeBackground") ||
          (styles.has("replaceBackground") && this.#backgroundImage)
        ) {
          segmenter = await this.#getSegmenter();
          segmentation = await segmenter.segmentPeople(this.#video);
        }

        if (styles.has("blur") && !styles.has("replaceBackground")) {
          await bodySegmentation.drawBokehEffect(
            this.#canvas,
            this.#video,
            segmentation,
            this.#blurConfig.foregroundThreshold,
            this.#blurConfig.blurAmount,
            this.#blurConfig.edgeBlurAmount,
            this.#blurConfig.flipHorizontal
          );
        }

        if (styles.has("removeBackground")) {
          const mask = await bodySegmentation.toBinaryMask(segmentation);
          const imageData = this.#context.getImageData(
            0,
            0,
            this.#canvas.width,
            this.#canvas.height
          );

          for (let i = 3; i < imageData.data.length; i += 4)
            if (mask.data[i] === 255) imageData.data[i] = 0;
          await bodySegmentation.drawMask(this.#canvas, imageData);
        }

        if (styles.has("replaceBackground") && this.#backgroundImage)
          await this.#applyBackgroundReplacement(segmentation);

        if (this.#activeStyles.has("filter")) this.#applyFilter();
        if (this.#activeStyles.has("enhance")) await this.#enhanceImage();
      }

      const { offsetX, offsetY, drawWidth, drawHeight } = this.#getImageSize(
        this.#finalCanvas,
        this.#canvas
      );

      this.#finalContext.drawImage(
        this.#canvas,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight
      );

      this.#animationId = requestAnimationFrame(loop);
    };

    if (!this.#animationId) this.#animationId = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.#animationId);
    this.#animationId = null;
  }
  enableStyle(styleName) {
    this.#activeStyles.add(styleName);
  }
  disableStyle(styleName) {
    this.#activeStyles.delete(styleName);
  }
  isStyleEnabled(styleName) {
    return this.#activeStyles.has(styleName);
  }
  resetStyles() {
    this.#activeStyles.clear();
  }
  setBackgroundImage(image) {
    this.#backgroundImage = image;
  }
  setFilterType(type) {
    this.#filterType = type; // "grayscale", "sepia", etc.
  }
  setBlurConfig(config) {
    Object.assign(this.#blurConfig, config);
  }
  setEnhanceConfig(config) {
    Object.assign(this.#enhanceConfig, config);
  }

  #applyFilter() {
    const imageData = this.#context.getImageData(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height
    );

    for (let i = 0; i < imageData.data.length; i += 4) {
      let r = imageData.data[i];
      let g = imageData.data[i + 1];
      let b = imageData.data[i + 2];

      switch (this.#filterType) {
        case "grayscale": {
          // Noir et blanc
          const avg = (r + g + b) / 3;
          r = g = b = avg;
          break;
        }

        case "night": {
          // Nuit
          r = r * 0.3;
          g = g * 0.3;
          b = b * 0.6 + 20;
          break;
        }

        case "sunny": {
          // Ensoleillé
          r = Math.min(255, r + 30);
          g = Math.min(255, g + 20);
          b = Math.max(0, b - 10);
          break;
        }

        case "cool": {
          // Froid
          r = Math.max(0, r - 20);
          g = Math.max(0, g - 10);
          b = Math.min(255, b + 30);
          break;
        }

        case "warm": {
          // Chaud
          r = Math.min(255, r + 40);
          g = Math.min(255, g + 20);
          b = Math.max(0, b - 20);
          break;
        }
      }

      imageData.data[i] = r;
      imageData.data[i + 1] = g;
      imageData.data[i + 2] = b;
    }

    this.#context.putImageData(imageData, 0, 0);
  }

  async #applyBackgroundReplacement(segmentation) {
    const mask = await bodySegmentation.toBinaryMask(segmentation);

    const imageCanvas = document.createElement("canvas");
    imageCanvas.width = this.#canvas.width;
    imageCanvas.height = this.#canvas.height;
    const imageContext = imageCanvas.getContext("2d");

    const { offsetX, offsetY, drawWidth, drawHeight } = this.#getImageSize(
      imageCanvas,
      this.#backgroundImage
    );

    imageContext.save();
    imageContext.translate(imageCanvas.width, 0);
    imageContext.scale(-1, 1);

    imageContext.drawImage(
      this.#backgroundImage,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );
    imageContext.restore();
    const bgData = imageContext.getImageData(
      0,
      0,
      imageCanvas.width,
      imageCanvas.height
    );

    const imageData = this.#context.getImageData(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height
    );

    for (let i = 0; i < imageData.data.length; i += 4) {
      if (mask.data[i + 3] === 255) {
        imageData.data[i] = bgData.data[i];
        imageData.data[i + 1] = bgData.data[i + 1];
        imageData.data[i + 2] = bgData.data[i + 2];
      }
    }

    this.#context.putImageData(imageData, 0, 0);
  }

  #getImageSize(canvas, image) {
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = image.width / image.height;
    let drawWidth, drawHeight;

    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = image.width * (canvas.height / image.height);
    } else {
      drawWidth = canvas.width;
      drawHeight = image.height * (canvas.width / image.width);
    }

    const offsetX = (canvas.width - drawWidth) / 2;
    const offsetY = (canvas.height - drawHeight) / 2;

    return { offsetX, offsetY, drawWidth, drawHeight };
  }
  getCurrentResolution() {
    return {
      width: this.#resolution.width,
      height: this.#resolution.height,
    };
  }
  setResolution(width, height) {
    if (typeof width === "number" && typeof height === "number") {
      this.#resolution.width = width;
      this.#resolution.height = height;
      this.#finalCanvas.width = width;
      this.#finalCanvas.height = height;
    }
  }

  setResolutionFactor(factor) {
    if (this.#video.videoWidth && this.#video.videoHeight) {
      this.#resolution.width = Math.round(this.#video.videoWidth * factor);
      this.#resolution.height = Math.round(this.#video.videoHeight * factor);
      this.#finalCanvas.width = this.#resolution.width;
      this.#finalCanvas.height = this.#resolution.height;
    }
  }
  resetResolution() {
    if (this.#video.videoWidth && this.#video.videoHeight) {
      this.#finalCanvas.width = this.#video.videoWidth;
      this.#finalCanvas.height = this.#video.videoHeight;
      this.#resolution.width = this.#video.videoWidth;
      this.#resolution.height = this.#video.videoHeight;
    }
  }

  async #enhanceImage() {
    const { brightness, contrast, gamma } = this.#enhanceConfig;
    const imageData = this.#context.getImageData(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height
    );
    const data = imageData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] + brightness; // R
      data[i + 1] = data[i + 1] + brightness; // G
      data[i + 2] = data[i + 2] + brightness; // B

      data[i] = factor * (data[i] - 128) + 128;
      data[i + 1] = factor * (data[i + 1] - 128) + 128;
      data[i + 2] = factor * (data[i + 2] - 128) + 128;

      data[i] = 255 * Math.pow(data[i] / 255, 1 / gamma);
      data[i + 1] = 255 * Math.pow(data[i + 1] / 255, 1 / gamma);
      data[i + 2] = 255 * Math.pow(data[i + 2] / 255, 1 / gamma);

      data[i] = Math.min(255, Math.max(0, data[i]));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2]));
    }
    this.#context.putImageData(imageData, 0, 0);
  }
}

export const streamSegmenter = new StreamSegmenter();
export default streamSegmenter;
