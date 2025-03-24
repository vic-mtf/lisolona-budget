import { Box, IconButton, Stack } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import { alpha } from "@mui/material";

const FloatOptions = () => {
  return (
    <Box
      flex={1}
      // zIndex={100}
      position='absolute'
      display='flex'
      height='100%'
      width='100%'
      justifyContent='center'
      alignItems='center'
      sx={{
        "& > *": {
          opacity: 0,
          transition: "opacity 0.2s",
          backdropFilter: "blur(15px)",
        },
        "&:hover": {
          "& > *": {
            opacity: 0.5,
            "&:hover": {
              opacity: 1,
            },
          },
        },
      }}>
      <Stack
        p={1}
        direction='row'
        spacing={1}
        borderRadius={1}
        sx={{ bgcolor: (theme) => alpha(theme.palette.common.black, 0.5) }}>
        <IconButton value='left' aria-label='left aligned'>
          <PushPinIcon />
        </IconButton>
        <IconButton value='left' aria-label='left aligned'>
          <MicNoneOutlinedIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default FloatOptions;
