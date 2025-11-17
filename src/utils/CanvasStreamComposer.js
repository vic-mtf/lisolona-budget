export default class CanvasStreamComposer extends EventTarget {
  #stage = null;
  #canvasStream;
  #ctxStream;

  #animKonva = null;

  constructor() {
    super();
    this.#canvasStream = document.createElement('canvas');
    this.#ctxStream = this.#canvasStream.getContext('2d');
  }

  setStage(stage) {
    if (!stage || typeof stage.getLayers !== 'function') {
      throw new TypeError('setStage() attend un Konva.Stage.');
    }

    this.#stage = stage;

    const w = stage.width();
    const h = stage.height();

    this.#canvasStream.width = w;
    this.#canvasStream.height = h;

    if (this.#animKonva) {
      this.#animKonva.stop();
    }

    this.#animKonva = new window.Konva.Animation(() => {
      this.#renderAll();
    }, stage);
    this.#animKonva.start();

    this.#dispatch('stageChanged', { stage });
  }

  #renderAll() {
    if (!this.#stage) return;
    const layers = this.#stage.getLayers();

    this.#ctxStream.clearRect(
      0,
      0,
      this.#canvasStream.width,
      this.#canvasStream.height
    );

    for (const layer of layers) {
      const c = layer.getCanvas()._canvas;
      if (c) {
        this.#ctxStream.drawImage(c, 0, 0);
      }
    }
  }

  captureStream(fps = 30) {
    return this.#canvasStream.captureStream(fps);
  }

  close() {
    if (this.#animKonva) {
      this.#animKonva.stop();
      this.#animKonva = null;
    }

    if (this.#stage) {
      this.#stage.off('frame');
    }

    this.#stage = null;
  }

  #dispatch(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }
}

export const canvasStreamComposer = new CanvasStreamComposer();
