import { noiseSuppressor } from "../utils/NoiseSuppressor";
import { Box } from "@mui/material";
import VolumeViewer from "./VolumeViewer";
import { useState } from "react";

const App = () => {
  const [stream, setStream] = useState({ raw: null, processed: null });

  return (
    <div style={{ position: "relative", height: "100vh", overflowY: "auto" }}>
      <Box width={300}>
        <VolumeViewer
          rawStream={stream.raw}
          processedStream={stream.processed}
        />
      </Box>

      <Box>
        <button
          onClick={async () => {
            const audioContext = new AudioContext();
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
            });
            const newStream = await noiseSuppressor.initStream(stream);
            setStream({ raw: stream, processed: newStream });
            console.log("Bonjour !");
            const source = audioContext.createMediaStreamSource(newStream);
            source.connect(audioContext.destination);

            //console.log(newStream);
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
