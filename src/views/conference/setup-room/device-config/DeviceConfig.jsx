import { Box, Toolbar, Divider, Paper } from "@mui/material";

import MicButton from "./buttons/MicButton";
import CameraButton from "./buttons/CameraButton";
import SpeakerButton from "./buttons/SpeakerButton";
import CameraMirrorVideo from "./CameraMirrorVideo";
import SettingButton from "./buttons/SettingButton";

const DeviceConfig = () => {
  return (
    <Box position='relative' mx={{ xs: 5, md: 0 }} mt={{ xs: 5, md: 0 }}>
      <Box
        position='relative'
        borderRadius={2}
        overflow='hidden'
        width='100%'
        component={Paper}
        elevation={0}>
        <CameraMirrorVideo />
        {/* <Divider /> */}
        <Toolbar
          sx={{ justifyContent: "center", gap: 2, borderRadius: 0 }}
          variant='dense'>
          <MicButton />
          <CameraButton />
          <SpeakerButton />
          <SettingButton />
        </Toolbar>
      </Box>
    </Box>
  );
};

export default DeviceConfig;
