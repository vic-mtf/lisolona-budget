import { NoiseSuppressorWorklet_Name } from "@timephy/rnnoise-wasm";
import NoiseSuppressorWorklet from "@timephy/rnnoise-wasm/NoiseSuppressorWorklet?worker&url";

class NoiseSuppressor {
  #ctx = null;
  #node = null;
  #source = null;
  #originalStream = null;
  #destination = null;
  #processedStream = null;
  #isActive = false;
  #onStreamReady = null;

  constructor(onStreamReady) {
    if (typeof onStreamReady === "function") {
      this.#onStreamReady = onStreamReady;
    }
  }

  async initStream(stream) {
    await this.#initAudioContext();

    this.#originalStream = stream;
    this.#node = new AudioWorkletNode(this.#ctx, NoiseSuppressorWorklet_Name);
    this.#source = this.#ctx.createMediaStreamSource(stream);
    this.#destination = this.#ctx.createMediaStreamDestination();

    this.#source.connect(this.#node).connect(this.#destination);
    this.#processedStream = this.#destination.stream;
    this.#isActive = true;

    if (typeof this.#onStreamReady === "function")
      this.#onStreamReady(this.#processedStream);

    return this.#processedStream;
  }
  toggleProcessing(enable) {
    if (!this.#source || !this.#node || !this.#destination) return;

    this.#source.disconnect();
    this.#node.disconnect();

    if (enable) {
      this.#source.connect(this.#node).connect(this.#destination);
      this.#isActive = true;
    } else {
      this.#source.connect(this.#destination);
      this.#isActive = false;
    }
  }

  updateConfig(config = {}) {
    if (this.#node?.port) {
      this.#node.port.postMessage({ type: "config", payload: config });
    }
  }

  isProcessingActive() {
    return this.#isActive;
  }

  async #initAudioContext() {
    if (!this.#ctx) {
      this.#ctx = new AudioContext();
      await this.#ctx.audioWorklet.addModule(NoiseSuppressorWorklet);
    }
  }

  getProcessedStream() {
    return this.#processedStream;
  }

  getOriginalStream() {
    return this.#originalStream;
  }
}

export const noiseSuppressor = new NoiseSuppressor();

export default noiseSuppressor;
