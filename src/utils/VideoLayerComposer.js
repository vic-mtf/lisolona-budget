export default class VideoLayerComposer extends EventTarget {
  /** @type {HTMLVideoElement} */ #video;
  /** @type {HTMLCanvasElement} */ #canvas;
  /** @type {CanvasRenderingContext2D} */ #ctx;
  /** @type {HTMLCanvasElement[]} */ #layers = [];
  /** @type {MediaStream | null} */ #stream = null;
  /** @type {number | null} */ #frameId = null;
  /** @type {boolean} */ #isRunning = false;

  constructor(inputStream, { width, height } = {}) {
    super();

    this.#video = document.createElement('video');
    this.#video.playsInline = true;
    this.#video.muted = true;
    this.#video.autoplay = true;

    this.#canvas = document.createElement('canvas');
    this.#ctx = this.#canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    });

    if (inputStream) this.setInputStream(inputStream, { width, height });
  }

  async setInputStream(stream, { width, height } = {}) {
    if (!(stream instanceof MediaStream))
      throw new TypeError('Le paramètre doit être un MediaStream.');

    this.stop();
    this.#stream = stream;

    const track = stream.getVideoTracks()[0];
    const settings = track?.getSettings?.() ?? {};

    const w = width || settings.width || 640;
    const h = height || settings.height || 480;

    this.#canvas.width = w;
    this.#canvas.height = h;

    this.#video.srcObject = stream;

    await new Promise((resolve, reject) => {
      const cleanup = () => {
        this.#video.onloadedmetadata = null;
        this.#video.onerror = null;
      };

      this.#video.onloadedmetadata = async () => {
        try {
          await this.#video.play();
          cleanup();
          this.#dispatch('ready');
          resolve();
        } catch (err) {
          cleanup();
          reject(err);
        }
      };

      this.#video.onerror = (err) => {
        cleanup();
        reject(err);
      };
    });
  }

  addLayers(...canvases) {
    for (const c of canvases) {
      if (!(c instanceof HTMLCanvasElement))
        throw new TypeError('Chaque couche doit être un élément <canvas>.');
      this.#layers.push(c);
    }
  }

  clearLayers() {
    this.#layers = [];
    this.#dispatch('layers-cleared');
  }

  start() {
    if (!this.#stream) throw new Error('Aucun flux vidéo défini.');
    if (this.#isRunning) return;

    this.#isRunning = true;

    if ('requestVideoFrameCallback' in this.#video) {
      const render = () => {
        if (!this.#isRunning) return;
        this.#drawFrame();
        this.#video.requestVideoFrameCallback(render);
      };
      this.#video.requestVideoFrameCallback(render);
    } else {
      const render = () => {
        if (!this.#isRunning) return;
        this.#drawFrame();
        this.#frameId = requestAnimationFrame(render);
      };
      this.#frameId = requestAnimationFrame(render);
    }

    this.#dispatch('started');
  }

  #drawFrame() {
    const { videoWidth, videoHeight } = this.#video;
    if (!videoWidth || !videoHeight) return;

    const ctx = this.#ctx;
    const canvas = this.#canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ratio = Math.min(
      canvas.width / videoWidth,
      canvas.height / videoHeight
    );
    const w = videoWidth * ratio;
    const h = videoHeight * ratio;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    ctx.drawImage(this.#video, x, y, w, h);

    for (const layer of this.#layers) {
      if (layer?.width === 0 || layer?.height === 0) return;
      ctx.drawImage(layer, 0, 0, canvas.width, canvas.height);
    }
  }

  pause() {
    if (this.#isRunning) {
      cancelAnimationFrame(this.#frameId);
      this.#isRunning = false;
      this.#dispatch('paused');
    }
  }

  stop() {
    this.pause();
    this.#dispatch('stopped');
  }

  /**
   * Retourne un MediaStream du canvas composé.
   * Si la composition n'est pas en cours, on la démarre pour garantir qu'il y ait
   * au moins une frame dans le canvas (évite les streams "vides").
   *
   * @param {number} [fps=60]
   * @returns {MediaStream}
   */
  getComposedStream(fps = 60) {
    // Si la boucle de rendu n'est pas active, démarre-la.
    // start() est idempotent (ne redémarre pas si déjà running).
    if (!this.#isRunning) {
      try {
        this.start();
      } catch (err) {
        console.error(err);
        // si start échoue (pas de stream, etc.), on laisse l'erreur remonter
        throw err;
      }
    }

    // assure un dessin immédiat afin d'avoir au moins une frame (sécurité)
    try {
      this.#drawFrame();
    } catch (e) {
      console.error(e);
      // ignore ; drawFrame peut échouer si vidéo non prête, mais start() devrait avoir aidé
    }

    return this.#canvas.captureStream(fps);
  }

  close() {
    this.stop();
    this.#video.pause();
    this.#video.srcObject = null;
    this.#stream?.getTracks().forEach((t) => t.stop());
    this.#stream = null;
    this.#dispatch('closed');
  }

  #dispatch(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }

  get isRunning() {
    return this.#isRunning;
  }

  get canvas() {
    return this.#canvas;
  }

  get videoElement() {
    return this.#video;
  }

  get layers() {
    return [...this.#layers];
  }

  get size() {
    return { width: this.#canvas.width, height: this.#canvas.height };
  }
}

export const videoLayerComposer = new VideoLayerComposer();
