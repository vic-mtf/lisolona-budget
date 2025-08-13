import { FilesetResolver, ImageSegmenter } from "@mediapipe/tasks-vision";
import mergeDeep from "./mergeDeep";
class StreamSegmenterMediaPipe {
  #canvas = null;
  #ctx = null;
  #video = null;
  #webcamRunning = false;
  #lastWebcamTime = -1;
  #imageSegmenter = null;
  #finalCanvas = null;
  #finalCtx = null;
  #animationId = null;
  #readyCallback = null;
  #blurCanvas = null;
  #blurCtx = null;
  #backgroundImage = null;
  #activeStyles = new Set();
  #filterType = "grayscale";
  #model = "selfie_multiclass_256x256.tflite";
  isReady = false;
  #filterBlur = "blur(5px)";

  #maskTypes = [
    "background",
    "hair",
    "body-skin",
    "face-skin",
    "clothes",
    "others",
  ];

  #resolution = {
    width: null,
    height: null,
  };
  #blurConfig = {
    foregroundThreshold: 0.7,
    blurAmount: 5,
    edgeBlurAmount: 20,
  };
  #enhanceConfig = {
    brightness: 20,
    contrast: 1.2,
    gamma: 1.0,
  };
  #contextConfig = { willReadFrequently: true };
  #mediaPipeConfig = {
    baseOptions: {
      modelAssetPath: `${import.meta.env.BASE_URL}/models/${this.#model}`,
      delegate: "GPU",
    },
    runningMode: "LIVE_STREAM",
    outputCategoryMask: true,
    outputConfidenceMasks: false,
  };

  constructor() {
    this.#canvas = document.createElement("canvas");
    this.#ctx = this.#canvas.getContext("2d", this.#contextConfig);
    this.#video = document.createElement("video");
    this.#video.autoplay = true;
    this.#video.muted = true;
    this.#video.playsInline = true;
    this.#finalCanvas = document.createElement("canvas");
    this.#finalCtx = this.#finalCanvas.getContext("2d", this.#contextConfig);
    this.#blurCanvas = document.createElement("canvas");
    this.#blurCtx = this.#blurCanvas.getContext("2d", this.#contextConfig);
  }

  #createImageSegmenter = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    return await ImageSegmenter.createFromOptions(
      vision,
      this.#mediaPipeConfig
    );
  };
  getImageSegmenter = async () => {
    this.#imageSegmenter ??= await this.#createImageSegmenter();
    return this.#imageSegmenter;
  };

  initStream = async (stream) => {
    const isSMediaStream = stream instanceof MediaStream;
    if (!isSMediaStream) return;
    this.#video.srcObject = stream;
    this.#webcamRunning = true;
    const processedStream = await new Promise((resolve) => {
      this.#video.onloadedmetadata = () => {
        const videoWidth = this.#video.videoWidth;
        const videoHeight = this.#video.videoHeight;
        this.#canvas.width = videoWidth;
        this.#canvas.height = videoHeight;
        this.#blurCanvas.width = videoWidth;
        this.#blurCanvas.height = videoHeight;
        this.#resolution.width ??= videoWidth;
        this.#resolution.height ??= videoHeight;
        this.#finalCanvas.width = this.#resolution.width;
        this.#finalCanvas.height = this.#resolution.height;

        this.isReady = true;
        if (typeof this.#readyCallback === "function")
          this.#readyCallback(this.getProcessedStream());
        resolve(this.getProcessedStream());
      };
    });
    await this.getImageSegmenter();
    if (this.#video.paused) this.#video.play();
    this.#predictWebcam();
    return processedStream;
  };
  getProcessedStream = () => {
    return this.#finalCanvas.captureStream();
  };

  onReady = (callback) => {
    this.#readyCallback = callback;
    if (this.isReady && typeof callback === "function")
      callback(this.getProcessedStream());
  };

  getOriginalStream = () => {
    return this.#video.srcObject;
  };
  #callbackForVideo = (result) => {
    const videoWidth = this.#video.videoWidth;
    const videoHeight = this.#video.videoHeight;
    let imageData = this.#ctx.getImageData(0, 0, videoWidth, videoHeight).data;

    const mask = result.categoryMask.getAsUint8Array();
    let blurImageData = null;

    let j = 0;
    for (let i = 0; i < mask.length; ++i) {
      if (mask[i] === this.#maskTypes.indexOf("background")) {
        if (this.#activeStyles.has("blur")) {
          if (this.#blurCtx.filter !== this.#filterBlur)
            this.#blurCtx.filter = this.#filterBlur;
          blurImageData ??= this.#blurCtx.getImageData(
            0,
            0,
            videoWidth,
            videoHeight
          ).data;
          const [r, g, b, a] = blurImageData.slice(j, j + 4);
          imageData[j] = r;
          imageData[j + 1] = g;
          imageData[j + 2] = b;
          imageData[j + 3] = a;
        }
      } else {
        if (this.#activeStyles.has("enhance")) this.#enhanceImage(imageData, j);
        //if (this.#activeStyles.has("blur")) this.#applyBlur(imageData, i);
      }
      if (this.#activeStyles.has("filter")) this.#applyFilter(imageData, j);
      j += 4;
    }
    const uint8Array = new Uint8ClampedArray(imageData.buffer);
    const dataNew = new ImageData(uint8Array, videoWidth, videoHeight);
    this.#ctx.putImageData(dataNew, 0, 0);

    if (this.#webcamRunning) {
      this.stop();
      this.#animationId ??= window.requestAnimationFrame(this.#predictWebcam);
    }
  };
  #predictWebcam = () => {
    if (this.#video.currentTime === this.#lastWebcamTime) {
      if (this.#webcamRunning) {
        this.stop();
        this.#animationId ??= window.requestAnimationFrame(this.#predictWebcam);
      }
      return;
    }

    this.#lastWebcamTime = this.#video.currentTime;
    const videoWidth = this.#video.videoWidth;
    const videoHeight = this.#video.videoHeight;

    const { offsetX, offsetY, drawWidth, drawHeight } = this.#getImageSize(
      this.#finalCanvas,
      this.#canvas
    );

    this.#finalCtx.clearRect(
      0,
      0,
      this.#finalCanvas.width,
      this.#finalCanvas.height
    );
    this.#finalCtx.drawImage(
      this.#canvas,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight
    );
    this.#ctx.drawImage(this.#video, 0, 0, videoWidth, videoHeight);
    if (this.#activeStyles.has("blur"))
      this.#blurCtx.drawImage(this.#video, 0, 0, videoWidth, videoHeight);
    if (!this.#imageSegmenter) return;
    let startTimeMs = performance.now();
    this.#imageSegmenter.segmentForVideo(
      this.#video,
      startTimeMs,
      this.#callbackForVideo
    );
  };
  #getImageSize = (canvas, image) => {
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
  };
  getCurrentResolution = () => {
    return {
      width: this.#resolution.width,
      height: this.#resolution.height,
    };
  };
  setResolution = (width, height) => {
    if (typeof width === "number" && typeof height === "number") {
      this.#resolution.width = width;
      this.#resolution.height = height;
      this.#finalCanvas.width = width;
      this.#finalCanvas.height = height;
    }
  };

  setResolutionFactor = (factor) => {
    if (this.#video.videoWidth && this.#video.videoHeight) {
      this.#resolution.width = Math.round(this.#video.videoWidth * factor);
      this.#resolution.height = Math.round(this.#video.videoHeight * factor);
      this.#finalCanvas.width = this.#resolution.width;
      this.#finalCanvas.height = this.#resolution.height;
    }
  };
  resetResolution = () => {
    if (this.#video.videoWidth && this.#video.videoHeight) {
      this.#finalCanvas.width = this.#video.videoWidth;
      this.#finalCanvas.height = this.#video.videoHeight;
      this.#resolution.width = this.#video.videoWidth;
      this.#resolution.height = this.#video.videoHeight;
    }
  };
  setMediaPipeConfig = (config) => {
    this.#mediaPipeConfig = mergeDeep(this.#mediaPipeConfig, config);
  };
  stop = () => {
    cancelAnimationFrame(this.#animationId);
    this.#animationId = null;
  };
  enableStyle = (styleName) => {
    this.#activeStyles.add(styleName);
  };
  disableStyle = (styleName) => {
    this.#activeStyles.delete(styleName);
  };
  isStyleEnabled = (styleName) => {
    return this.#activeStyles.has(styleName);
  };
  resetStyles = () => {
    this.#activeStyles.clear();
  };
  setFilterType(type) {
    this.#filterType = type; // "grayscale", "sepia", etc.
  }

  #enhanceImage = (data, i) => {
    const { brightness, contrast, gamma } = this.#enhanceConfig;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
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
  };

  #applyFilter = (data, i) => {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    switch (this.#filterType) {
      // Noir et blanc
      case "grayscale": {
        const avg = (r + g + b) / 3;
        r = g = b = avg;
        break;
      }

      // Nuit
      case "night": {
        r = r * 0.3;
        g = g * 0.3;
        b = b * 0.6 + 20;
        break;
      }

      // Ensoleillé
      case "sunny": {
        r = Math.min(255, r + 30);
        g = Math.min(255, g + 20);
        b = Math.max(0, b - 10);
        break;
      }

      // Froid
      case "cool": {
        r = Math.max(0, r - 20);
        g = Math.max(0, g - 10);
        b = Math.min(255, b + 30);
        break;
      }

      // Chaud
      case "warm": {
        r = Math.min(255, r + 40);
        g = Math.min(255, g + 20);
        b = Math.max(0, b - 20);
        break;
      }
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  };
}
export const streamSegmenterMediaPipe = new StreamSegmenterMediaPipe();
export default streamSegmenterMediaPipe;
