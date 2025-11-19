export default class CanvasStreamComposer extends EventTarget {
  #stage = null;
  #canvasStream;
  #ctxStream;
  #initFps = 30;
  #animKonva = null;

  constructor() {
    super();
    this.#canvasStream = document.createElement('canvas');
    this.#ctxStream = this.#canvasStream.getContext('2d');
  }

  setStage(stage, fps = this.#initFps) {
    if (!stage || typeof stage.getLayers !== 'function') {
      console.error('setStage() requires a Konva Stage');
      return;
    }

    this.#stage = stage;

    const w = stage.width() / stage.scaleX();
    const h = stage.height() / stage.scaleY();

    this.#canvasStream.width = w;
    this.#canvasStream.height = h;

    if (this.#animKonva) this.#animKonva.stop();
    else this.#dispatch('start', { stream: this.captureStream(fps) });

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
        this.#ctxStream.drawImage(
          c,
          0,
          0,
          this.#canvasStream.width,
          this.#canvasStream.height
        );
      }
    }
  }

  captureStream(fps = this.#initFps) {
    return this.#canvasStream.captureStream(fps);
  }

  close() {
    if (this.#animKonva) {
      this.#animKonva.stop();
      this.#animKonva = null;
    }
    if (this.#stage) this.#stage.off('frame');
    this.#stage = null;
    this.#dispatch('close');
  }

  #dispatch(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }
}

export const canvasStreamComposer = new CanvasStreamComposer();
