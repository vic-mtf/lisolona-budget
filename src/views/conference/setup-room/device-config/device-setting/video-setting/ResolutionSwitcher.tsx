import { Box, TextField, MenuItem } from "@mui/material";
import { streamSegmenterMediaPipe } from "@/utils/StreamSegmenterMediaPipe";
import { useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";

const ResolutionSwitcher = () => {
  const [resolution, setResolution] = useState(
    () =>
      resolutions.find(({ value }) => {
        const { width, height } = value;
        const current = streamSegmenterMediaPipe.getCurrentResolution();
        return width === current.width && height === current.height;
      })?.id || "auto"
  );

  return (
    <Box sx={{ mt: 2, mx: 1 }}>
      <ListSubheader
        sx={{ bgcolor: "transparent", position: "relative", px: 0 }}>
        {"Résolution maximale à l'envoi"}
      </ListSubheader>
      <TextField
        select
        fullWidth
        value={resolution}
        onChange={(e) => {
          const value = e.target.value;
          setResolution(value);
          const { width, height } = resolutions.find(
            ({ id }) => id === value
          ).value;
          if (value === "auto") streamSegmenterMediaPipe.resetResolution();
          else streamSegmenterMediaPipe.setResolution(width, height);
        }}>
        {resolutions.map(({ label, id }, index) => {
          return (
            <MenuItem key={index} value={id}>
              {label}
            </MenuItem>
          );
        })}
      </TextField>
      <Typography variant='body2' color='text.secondary' mt={1}>
        La résolution à la réception est ajustée dynamiquement en fonction des
        conditions réseau
      </Typography>
    </Box>
  );
};

const defaultResolution = streamSegmenterMediaPipe.getCurrentResolution();

const resolutions = [
  {
    label: "Automatique",
    id: "auto",
    value: {
      height: defaultResolution.height,
      width: defaultResolution.width,
    },
  },
  //   {
  //     label: "1080p (Full HD)",
  //     id: "1080p",
  //     value: {
  //       height: 1080,
  //       width: 1920,
  //     },
  //   },
  {
    label: "Haute définition (720p)",
    id: "720p",
    value: {
      height: 720,
      width: 1280,
    },
  },
  {
    label: "Définition standard (480p)",
    id: "480p",
    value: {
      height: 480,
      width: 854,
    },
  },
  {
    label: "Basse définition (360p)",
    id: "360p",
    value: {
      height: 360,
      width: 640,
    },
  },
  {
    label: "Définition très basse (180p)",
    id: "180p",
    value: {
      height: 180,
      width: 320,
    },
  },
];

export default ResolutionSwitcher;
