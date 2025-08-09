import { Box } from "@mui/material";
import AudioLevel from "./AudioLevel";
import NoiseControl from "./NoiseControl";
import SpeakerList from "./SpeakerList";
import MicrophoneList from "./MicrophoneList";

const AudioSetting = () => {
  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
      <Box p={2} sx={{ borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
        <AudioLevel />
      </Box>
      <NoiseControl />
      <MicrophoneList />
      <SpeakerList />
    </Box>
  );
};

export default AudioSetting;
