import { Box as MuiBox } from "@mui/material";

export default function ViewAudioTrack({ audioTrack, type = "camera" }) {
  return (
    <MuiBox
      position='relative'
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}></MuiBox>
  );
}
