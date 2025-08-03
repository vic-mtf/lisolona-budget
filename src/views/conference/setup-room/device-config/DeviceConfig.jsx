import { Box, Toolbar, Divider, Paper, Typography } from "@mui/material";
import { alpha } from "@mui/system";
import SplitButton, { CustomIconButton } from "./SplitButton";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
// import VolumeDownOutlinedIcon from "@mui/icons-material/VolumeDownOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SpeakerOutlinedIcon from "@mui/icons-material/SpeakerOutlined";
import MicButton from "./buttons/MicButton";
import CameraButton from "./buttons/CameraButton";

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
        <Box width={{ md: 600 }} position='relative'>
          <Box
            component='video'
            sx={{
              aspectRatio: { xs: 9 / 16, md: 16 / 9 },
              bgcolor: (t) => alpha(t.palette.common.black, 0.5),
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <Typography
            position='absolute'
            top={0}
            height='100%'
            width='100%'
            sx={{ color: (t) => t.palette.grey[500] }}
            display='flex'
            alignItems='center'
            justifyContent='center'
            gap={1}
            flexDirection='column'
            zIndex={1}>
            <VideocamOffOutlinedIcon fontSize='large' />
            Votre caméra est désactivée
          </Typography>
        </Box>
        <Divider />
        <Toolbar
          sx={{ justifyContent: "center", gap: 2, borderRadius: 0 }}
          variant='dense'>
          <MicButton />
          <CameraButton />

          <CustomIconButton>
            <SpeakerOutlinedIcon />
          </CustomIconButton>
          <CustomIconButton>
            <SettingsOutlinedIcon />
          </CustomIconButton>
        </Toolbar>
      </Box>
    </Box>
  );
};

export default DeviceConfig;
