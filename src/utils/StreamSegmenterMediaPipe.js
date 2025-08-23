import { FilesetResolver, ImageSegmenter } from "@mediapipe/tasks-vision";
import mergeDeep from "./mergeDeep";
import axios from "axios";

class StreamSegmenterMediaPipe {
  #canvas = null;
  #ctx = null;
  #video = null;
  #lastWebcamTime = -1;
  #startTimeMs = null;
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
  #localModelAssetPath = null;
  #remoteModelAssetPath =
    "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite";
  #loadingModel = false;
  updateProgressModel = null;
  downloadProgressModel = null;
  loadedModel = null;
  #model = "selfie_segmenter.tflite";
  #useMaskTypes = ["blur", "replaceBackground", "removeBackground"];

  isReady = false;
  #filterBlur = 10;

  #maskTypes = [
    "background",
    "hair",
    "body-skin",
    "face-skin",
    "clothes",
    "others",
  ];
  #useNoMaskTypes = ["enhance", "filter"];

  #qualityConfig = {
    maxProcessingWidth: 640,
    maxProcessingHeight: 480,
    outputWidth: null,
    outputHeight: null,
    autoQualityFactor: true,
    qualityThresholds: {
      high: { width: 1920, height: 1080 },
      medium: { width: 1280, height: 720 },
      low: { width: 640, height: 480 },
    },
  };

  #resolution = {
    width: null,
    height: null,
    processingWidth: null,
    processingHeight: null,
  };

  #enhanceConfig = {
    brightness: 15,
    contrast: 1.5,
    gamma: 1.2,
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

  #downloadModel = async () => {
    if (this.#localModelAssetPath || this.#loadingModel) return;
    let response = null;
    this.#loadingModel = true;
    try {
      response = await axios({
        url: this.#remoteModelAssetPath,
        responseType: "blob",
        onDownloadProgress: (e) => {
          if (typeof this.downloadProgressModel === "function")
            this.downloadProgressModel(e.loaded / e.total);
        },
        onUploadProgress: (e) => {
          if (typeof this.updateProgressModel === "function")
            this.updateProgressModel(e.loaded / e.total);
        },
      });
      // Nettoyage ancien blob si existant
      if (this.#localModelAssetPath) {
        URL.revokeObjectURL(this.#localModelAssetPath);
      }
      const modelUrl = URL.createObjectURL(response.data);
      this.#localModelAssetPath = modelUrl;
      this.#mediaPipeConfig.baseOptions.modelAssetPath = modelUrl;
      await this.getImageSegmenter();
    } catch (error) {
      console.error("Error downloading model:", error);
    }
    if (typeof this.loadedModel === "function")
      this.loadedModel(response?.data);
    this.#loadingModel = false;
  };

  getModelStats = () => {
    return {
      localModelAssetPath: this.#localModelAssetPath,
      loadingModel: this.#loadingModel,
    };
  };

  #calculateOptimalDimensions = (videoWidth, videoHeight) => {
    const {
      maxProcessingWidth,
      maxProcessingHeight,
      autoQualityFactor,
      qualityThresholds,
    } = this.#qualityConfig;

    let processingWidth = videoWidth;
    let processingHeight = videoHeight;
    let outputWidth = this.#qualityConfig.outputWidth || videoWidth;
    let outputHeight = this.#qualityConfig.outputHeight || videoHeight;

    if (videoWidth > maxProcessingWidth || videoHeight > maxProcessingHeight) {
      const widthRatio = maxProcessingWidth / videoWidth;
      const heightRatio = maxProcessingHeight / videoHeight;
      const scaleFactor = Math.min(widthRatio, heightRatio);

      processingWidth = Math.round(videoWidth * scaleFactor);
      processingHeight = Math.round(videoHeight * scaleFactor);
    }

    if (autoQualityFactor) {
      if (
        videoWidth >= qualityThresholds.high.width ||
        videoHeight >= qualityThresholds.high.height
      ) {
        processingWidth = Math.min(processingWidth, 640);
        processingHeight = Math.min(processingHeight, 480);
      } else if (
        videoWidth >= qualityThresholds.medium.width ||
        videoHeight >= qualityThresholds.medium.height
      ) {
        processingWidth = Math.min(processingWidth, 720);
        processingHeight = Math.min(processingHeight, 576);
      }
    }

    processingWidth =
      processingWidth % 2 === 0 ? processingWidth : processingWidth - 1;
    processingHeight =
      processingHeight % 2 === 0 ? processingHeight : processingHeight - 1;
    outputWidth = outputWidth % 2 === 0 ? outputWidth : outputWidth - 1;
    outputHeight = outputHeight % 2 === 0 ? outputHeight : outputHeight - 1;

    return {
      processing: { width: processingWidth, height: processingHeight },
      output: { width: outputWidth, height: outputHeight },
    };
  };

  initStream = async (stream) => {
    const isSMediaStream = stream instanceof MediaStream;
    if (!isSMediaStream) return;

    this.#video.srcObject = stream;

    const processedStream = await new Promise((resolve) => {
      this.#video.onloadedmetadata = () => {
        const videoWidth = this.#video.videoWidth;
        const videoHeight = this.#video.videoHeight;

        const dimensions = this.#calculateOptimalDimensions(
          videoWidth,
          videoHeight
        );

        this.#canvas.width = dimensions.processing.width;
        this.#canvas.height = dimensions.processing.height;
        this.#blurCanvas.width = dimensions.processing.width;
        this.#blurCanvas.height = dimensions.processing.height;

        this.#finalCanvas.width = dimensions.output.width;
        this.#finalCanvas.height = dimensions.output.height;

        this.#resolution.processingWidth = dimensions.processing.width;
        this.#resolution.processingHeight = dimensions.processing.height;
        this.#resolution.width = dimensions.output.width;
        this.#resolution.height = dimensions.output.height;

        if (import.meta.env.DEV)
          console.log(
            `Optimisation qualité:\n  - Vidéo source: ${videoWidth}x${videoHeight}\n  - Traitement: ${dimensions.processing.width}x${dimensions.processing.height}\n  - Sortie: ${dimensions.output.width}x${dimensions.output.height}`
          );

        this.isReady = true;
        if (typeof this.#readyCallback === "function")
          this.#readyCallback(this.getProcessedStream());
        resolve(this.getProcessedStream());
      };
    });

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

  #applyMaskOptimized = (
    imageData,
    mask,
    blurImageData,
    hasBlur,
    hasReplace
  ) => {
    const data = new Uint32Array(imageData.data.buffer);
    const blurData = blurImageData
      ? new Uint32Array(blurImageData.data.buffer)
      : null;

    for (let j = 0; j < mask.length; j++) {
      if (mask[j] === 0) {
        if (hasReplace) data[j] = 0x00000000;
        else if (hasBlur && blurData) data[j] = blurData[j];
      }
    }
  };

  #callbackForVideo = (result) => {
    let imageData = this.#getImageData(this.#ctx);
    const pixels = imageData.data;

    const hasBlur = this.#activeStyles.has("blur");
    const hasReplace = this.#activeStyles.has("replaceBackground");

    if ((hasBlur || hasReplace) && result) {
      let mask = result?.categoryMask?.getAsFloat32Array();
      let blurImageData = hasBlur ? this.#getImageData(this.#blurCtx) : null;
      this.#applyMaskOptimized(
        imageData,
        mask,
        blurImageData,
        hasBlur,
        hasReplace
      );
    }

    if (this.#useNoMaskTypes.some((s) => this.#activeStyles.has(s))) {
      let factor = null;
      let invGamma = null;
      for (let i = 0; i < pixels.length; i += 4) {
        if (this.#activeStyles.has("filter")) this.#applyFilter(pixels, i);
        if (this.#activeStyles.has("enhance")) {
          factor ??= this.#getFactor();
          invGamma ??= 1 / this.#enhanceConfig.gamma;
          this.#applyEnhanceImage(pixels, factor, invGamma, i);
        }
      }
    }
    if (this.#activeStyles.size > 0) this.#ctx.putImageData(imageData, 0, 0);

    this.#finalCtx.imageSmoothingEnabled = true;
    this.#finalCtx.imageSmoothingQuality = "high";

    if (this.#backgroundImage && hasReplace)
      this.#drawImage(this.#finalCanvas, this.#backgroundImage, this.#finalCtx);

    this.#drawImage(this.#finalCanvas, this.#canvas, this.#finalCtx);
    this.#animationId = window.requestAnimationFrame(this.#predictWebcam);
  };

  #predictWebcam = () => {
    if (this.#video.currentTime === this.#lastWebcamTime) {
      this.#animationId = window.requestAnimationFrame(this.#predictWebcam);
      return;
    }
    this.#lastWebcamTime = this.#video.currentTime;

    this.#drawVideo(this.#ctx);

    if (this.#activeStyles.has("blur")) {
      this.#blurCtx.filter = `blur(${this.#filterBlur}px)`;
      this.#drawVideo(this.#blurCtx);
      this.#blurCtx.filter = "none";
    }

    if (!this.#imageSegmenter) {
      this.#animationId = window.requestAnimationFrame(() =>
        this.#callbackForVideo()
      );
      if (this.#useMaskTypes.some((s) => this.#activeStyles.has(s)))
        if (!this.#loadingModel && !this.#localModelAssetPath)
          this.#downloadModel();
      return;
    }

    this.#startTimeMs = performance.now();
    this.#imageSegmenter.segmentForVideo(
      this.#canvas,
      this.#startTimeMs,
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

  #drawImage = (canvas, image, ctx) => {
    const { offsetX, offsetY, drawWidth, drawHeight } = this.#getImageSize(
      canvas,
      image
    );
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  };

  #getImageData = (ctx) => {
    return ctx.getImageData(
      0,
      0,
      this.#resolution.processingWidth,
      this.#resolution.processingHeight
    );
  };

  #getFactor = () => {
    return (
      (259 * (this.#enhanceConfig.contrast + 255)) /
      (255 * (259 - this.#enhanceConfig.contrast))
    );
  };

  #drawVideo = (ctx) => {
    ctx.drawImage(
      this.#video,
      0,
      0,
      this.#resolution.processingWidth,
      this.#resolution.processingHeight
    );
  };

  getCurrentResolution = () => {
    return {
      width: this.#resolution.width,
      height: this.#resolution.height,
      processingWidth: this.#resolution.processingWidth,
      processingHeight: this.#resolution.processingHeight,
    };
  };

  setQualityConfig = (config) => {
    this.#qualityConfig = mergeDeep(this.#qualityConfig, config);
  };

  setMaxProcessingResolution = (width, height) => {
    this.#qualityConfig.maxProcessingWidth = width;
    this.#qualityConfig.maxProcessingHeight = height;
  };

  setOutputResolution = (width, height) => {
    this.#qualityConfig.outputWidth = width;
    this.#qualityConfig.outputHeight = height;
    this.#resolution.width = width;
    this.#resolution.height = height;
    this.#finalCanvas.width = width;
    this.#finalCanvas.height = height;
  };

  enableAutoQuality = (enabled = true) => {
    this.#qualityConfig.autoQualityFactor = enabled;
  };

  setResolution = (width, height) => {
    this.setOutputResolution(width, height);
  };
  setBackgroundImage(image) {
    this.#backgroundImage = image;
  }
  setResolutionFactor = (factor) => {
    if (this.#video.videoWidth && this.#video.videoHeight) {
      const newWidth = Math.round(this.#video.videoWidth * factor);
      const newHeight = Math.round(this.#video.videoHeight * factor);
      this.setOutputResolution(newWidth, newHeight);
    }
  };

  resetResolution = () => {
    if (this.#video.videoWidth && this.#video.videoHeight) {
      this.#qualityConfig.outputWidth = null;
      this.#qualityConfig.outputHeight = null;
      const dimensions = this.#calculateOptimalDimensions(
        this.#video.videoWidth,
        this.#video.videoHeight
      );
      this.#finalCanvas.width = dimensions.output.width;
      this.#finalCanvas.height = dimensions.output.height;
      this.#resolution.width = dimensions.output.width;
      this.#resolution.height = dimensions.output.height;
    }
  };

  setMediaPipeConfig = (config) => {
    this.#mediaPipeConfig = mergeDeep(this.#mediaPipeConfig, config);
  };

  stop = async () => {
    if (this.#animationId) {
      cancelAnimationFrame(this.#animationId);
      this.#animationId = null;
    }
    if (this.#imageSegmenter?.close) {
      try {
        await this.#imageSegmenter.close();
      } catch (error) {
        console.error(error);
      }
      this.#imageSegmenter = null;
    }
  };

  enableStyle = (styleName) => {
    this.#activeStyles.add(styleName);
  };

  disableStyle = (styleName) => {
    this.#activeStyles.delete(styleName);
  };

  toggleStyle = (styleName) => {
    if (this.#activeStyles.has(styleName)) this.#activeStyles.delete(styleName);
    else this.#activeStyles.add(styleName);
  };

  getEnabledStyles = () => Array.from(this.#activeStyles);

  isStyleEnabled = (styleName) => {
    return this.#activeStyles.has(styleName);
  };

  resetStyles = () => {
    this.#activeStyles.clear();
  };

  setFilterType(type) {
    this.#filterType = type;
  }

  #applyEnhanceImage = (data, factor, invGamma, i) => {
    data[i] = Math.min(
      255,
      Math.max(
        0,
        255 *
          Math.pow(
            (factor * (data[i] + this.#enhanceConfig.brightness - 128)) / 255 +
              128 / 255,
            invGamma
          )
      )
    );
    data[i + 1] = Math.min(
      255,
      Math.max(
        0,
        255 *
          Math.pow(
            (factor * (data[i + 1] + this.#enhanceConfig.brightness - 128)) /
              255 +
              128 / 255,
            invGamma
          )
      )
    );
    data[i + 2] = Math.min(
      255,
      Math.max(
        0,
        255 *
          Math.pow(
            (factor * (data[i + 2] + this.#enhanceConfig.brightness - 128)) /
              255 +
              128 / 255,
            invGamma
          )
      )
    );
  };

  #applyFilter = (data, i) => {
    let r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    switch (this.#filterType) {
      case "grayscale":
        r = g = b = (r + g + b) / 3;
        break;
      case "night":
        r *= 0.3;
        g *= 0.3;
        b = b * 0.6 + 20;
        break;
      case "sunny":
        r = Math.min(255, r + 30);
        g = Math.min(255, g + 20);
        b = Math.max(0, b - 10);
        break;
      case "cool":
        r = Math.max(0, r - 20);
        g = Math.max(0, g - 10);
        b = Math.min(255, b + 30);
        break;
      case "warm":
        r = Math.min(255, r + 40);
        g = Math.min(255, g + 20);
        b = Math.max(0, b - 20);
        break;
    }
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  };
}

export const streamSegmenterMediaPipe = new StreamSegmenterMediaPipe();
export default streamSegmenterMediaPipe;
