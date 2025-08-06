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
  #segmenter;
  #animationId;
  #readyCallback;
  #backgroundImage;
  #activeStyles = new Set();
  #filterType = "grayscale";
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
    this.#video.autoplay = true;
    this.#video.playsInline = true;
    this.#video.muted = true;
    this.#context = this.#canvas.getContext("2d");
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
    return this.#canvas.captureStream();
  }

  #startRenderLoop() {
    const loop = async () => {
      this.#context.drawImage(
        this.#video,
        0,
        0,
        this.#canvas.width,
        this.#canvas.height
      );

      if (this.#activeStyles.size > 0) {
        let segmenter;
        let segmentation;
        if (
          !(this.#activeStyles.size === 1 && this.#activeStyles.has("filter"))
        ) {
          segmenter = await this.#getSegmenter();
          segmentation = await segmenter.segmentPeople(this.#video);
        }

        if (this.#activeStyles.has("blur")) {
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

        if (this.#activeStyles.has("removeBackground")) {
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

        if (
          this.#activeStyles.has("replaceBackground") &&
          this.#backgroundImage
        )
          await this.#applyBackgroundReplacement(segmentation);

        if (this.#activeStyles.has("filter")) this.#applyFilter(segmentation);
        if (this.#activeStyles.has("enhance"))
          await this.#enhanceImage(segmentation);
      }

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
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];

      switch (this.#filterType) {
        case "grayscale": {
          const avg = (r + g + b) / 3;
          imageData.data[i] =
            imageData.data[i + 1] =
            imageData.data[i + 2] =
              avg;
          break;
        }
        case "sepia":
          imageData.data[i] = r * 0.393 + g * 0.769 + b * 0.189;
          imageData.data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
          imageData.data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
          break;
      }
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

  async #enhanceImage(segmentation) {
    const mask = await bodySegmentation.toBinaryMask(segmentation);
    const { brightness, contrast, gamma } = this.#enhanceConfig;
    const imageData = this.#context.getImageData(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height
    );
    const data = imageData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4)
      if (mask.data[i] !== 255) {
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

    await bodySegmentation.drawMask(this.#canvas, imageData);
  }
}

export const streamSegmenter = new StreamSegmenter();
export default streamSegmenter;
