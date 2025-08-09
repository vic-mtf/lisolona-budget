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
    this.setOnStreamReady(onStreamReady);
  }

  async initStream(stream) {
    await this.#initAudioContext();

    this.#originalStream = stream;
    this.#source = this.#ctx.createMediaStreamSource(stream);
    this.#node = new AudioWorkletNode(this.#ctx, NoiseSuppressorWorklet_Name);
    this.#destination = this.#ctx.createMediaStreamDestination();

    // Connexion sans traitement par défaut
    this.#source.connect(this.#destination);
    this.#processedStream = this.#destination.stream;

    if (typeof this.#onStreamReady === "function") 
      this.#onStreamReady(this.#processedStream);
    

    return this.#processedStream;
  }

  toggleProcessing(enable) {
    if (!this.#source || !this.#node || !this.#destination) return;

    this.#source.disconnect();
    this.#node.disconnect();

    if (enable && !this.#isActive) {
      this.#source.connect(this.#node).connect(this.#destination);
      this.#isActive = true;
    } else if (!enable && this.#isActive) {
      this.#source.connect(this.#destination);
      this.#isActive = false;
    }
  }

  updateConfig(config = {}) {
    if (this.#node?.port) 
      this.#node.port.postMessage({ type: "config", payload: config });
    
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

  setOnStreamReady(callback) {
    if (typeof callback === "function") 
      this.#onStreamReady = callback(this.#processedStream);
     else 
      console.warn("setOnStreamReady: callback must be a function");
    
  }
}

export const noiseSuppressor = new NoiseSuppressor();
