import RichTextEditor from "./RichTextEditor";
import ImageLikeSkeleton from "./ImageLikeSkeleton";
import { noiseSuppressor } from "../utils/NoiseSuppressor";
import { Box } from "@mui/material";
import { NoiseSuppressorWorklet_Name } from "@timephy/rnnoise-wasm";
// This is an example how to get the script path using Vite, may be different when using other build tools
// NOTE: `?worker&url` is important (`worker` to generate a working script, `url` to get its url to load it)
//import NoiseSuppressorWorklet from "@timephy/rnnoise-wasm/NoiseSuppressorWorklet?worker&url";

async function example(stream) {
  // Load the NoiseSuppressorWorklet into the AudioContext
  const NoiseSuppressorWorklet = await import(
    "@timephy/rnnoise-wasm/NoiseSuppressorWorklet?worker&url"
  );
  const ctx = new AudioContext();
  await ctx.audioWorklet.addModule(NoiseSuppressorWorklet);

  // Instantiate the Worklet as a Node
  const noiseSuppressionNode = new AudioWorkletNode(
    ctx,
    NoiseSuppressorWorklet_Name
  );
  const source = ctx.createMediaStreamSource(stream);
  source
    .connect(noiseSuppressionNode) // pass audio through noise suppression
    .connect(ctx.destination); // playback audio on output device
}

const App = () => {
  return (
    <div style={{ position: "relative", height: "100vh", overflowY: "auto" }}>
      <Box>
        <button
          onClick={async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
            });
            example(stream);
          }}>
          start listening
        </button>
        <button onClick={() => noiseSuppressor.toggleProcessing(true)}>
          resume
        </button>
        <button onClick={() => noiseSuppressor.toggleProcessing(false)}>
          pause
        </button>
      </Box>
    </div>
  );
};

export default App;
