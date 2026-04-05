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
  #onError = null;

  constructor(onStreamReady) {
    this.setOnStreamReady(onStreamReady);
  }

  async initStream(stream) {
    if (!(stream instanceof MediaStream)) return null;

    // Si on relance avec un nouveau stream, nettoyer l'ancien graphe
    if (this.#source || this.#destination) {
      try {
        this.toggleProcessing(false);
      } catch (err) {
        console.error(err);
      }
      try {
        this.#source?.disconnect();
      } catch (err) {
        console.error(err);
      }
      try {
        this.#node?.disconnect();
      } catch (err) {
        console.error(err);
      }
    }

    await this.#initAudioContext();

    this.#originalStream = stream;
    this.#source = this.#ctx.createMediaStreamSource(stream);

    // (Ré)instancie le worklet node si nécessaire
    if (!this.#node) {
      try {
        this.#node = new AudioWorkletNode(
          this.#ctx,
          NoiseSuppressorWorklet_Name
        );
      } catch (e) {
        this.#emitError(e);
        throw e;
      }
    }

    this.#destination = this.#ctx.createMediaStreamDestination();

    // Connexions initiales
    if (this.#isActive) {
      this.#source.connect(this.#node).connect(this.#destination);
    } else {
      this.#source.connect(this.#destination);
    }

    this.#processedStream = this.#destination.stream;

    if (typeof this.#onStreamReady === "function") {
      try {
        this.#onStreamReady(this.#processedStream);
      } catch (err) {
        console.error(err);
      }
    }

    return this.#processedStream;
  }

  toggleProcessing(enable) {
    if (!this.#source || !this.#destination) return;

    // Déconnecter proprement l'existant
    try {
      this.#source.disconnect();
    } catch (err) {
      console.error(err);
    }
    try {
      this.#node?.disconnect();
    } catch (err) {
      console.error(err);
    }

    if (enable) {
      if (!this.#node) return; // rien à faire si node absent
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
      this.#ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (this.#ctx.state === "suspended") {
      try {
        await this.#ctx.resume();
      } catch (e) {
        this.#emitError(e);
      }
    }

    // Charger le worklet module si non chargé
    // Safari/Firefox/Chrome ne retiennent pas d'état "chargé" accessible, on tente donc un addModule idempotent
    try {
      await this.#ctx.audioWorklet.addModule(NoiseSuppressorWorklet);
    } catch (e) {
      // Si le module est déjà chargé, certains UA lèvent une erreur bénigne; on l'ignore.
      const msg = String(e?.message || e);
      const alreadyLoaded = /already|exists|duplicate/i.test(msg);
      if (!alreadyLoaded) this.#emitError(e);
    }
  }

  getProcessedStream() {
    return this.#processedStream;
  }

  getOriginalStream() {
    return this.#originalStream;
  }

  setOnStreamReady(callback) {
    if (typeof callback === "function") {
      this.#onStreamReady = callback; // on stocke la fonction
      // Si un stream est déjà prêt, on notifie immédiatement
      if (this.#processedStream) {
        try {
          this.#onStreamReady(this.#processedStream);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  setOnError(callback) {
    if (typeof callback === "function") this.#onError = callback;
  }

  #emitError(err) {
    if (typeof this.#onError === "function") {
      try {
        this.#onError(err);
      } catch (err) {
        console.error(err);
      }
    } else {
      // fallback console pour faciliter le debug

      console.error("NoiseSuppressor error:", err);
    }
  }

  async destroy() {
    // couper le flow audio
    try {
      this.toggleProcessing(false);
    } catch (err) {
      console.error(err);
    }

    // couper les connexions
    try {
      this.#source?.disconnect();
    } catch (err) {
      console.error(err);
    }
    try {
      this.#node?.disconnect();
    } catch (err) {
      console.error(err);
    }

    // fermer l'audio context
    if (this.#ctx && this.#ctx.state !== "closed") {
      try {
        await this.#ctx.close();
      } catch (err) {
        console.error(err);
      }
    }

    // reset complet
    this.#ctx = null;
    this.#node = null;
    this.#source = null;
    this.#destination = null;
    this.#processedStream = null;
    this.#originalStream = null;
    this.#isActive = false;
  }
}

export const noiseSuppressor = new NoiseSuppressor();
export default NoiseSuppressor;
