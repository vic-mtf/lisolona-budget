import { useMemo } from "react";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import VolumeBar from "../../VolumeBar";
import { useSelector } from "react-redux";
import { noiseSuppressor } from "../../../../../../utils/NoiseSuppressor";

const AudioLevel = () => {
  const enabled = useSelector(
    (store) =>
      store.conference.setup.devices.processedMicrophoneStream.noiseSuppressor
  );

  const rawStream = useMemo(() => {
    if (!enabled) return null;
    return noiseSuppressor.getOriginalStream();
  }, [enabled]);

  return (
    <>
      <ListItem disableGutters sx={{ mb: 1.5 }}>
        <Box mr={1} display='flex' alignItems='center' justifyContent='center'>
          <MicNoneOutlinedIcon />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <VolumeBar enabled rawStream={rawStream} />
        </Box>
      </ListItem>
      <Box display='flex' flexDirection='row' gap={4} mx={1}>
        <Legend
          label='Son à la sortie'
          color={(t) =>
            t.palette.common[t.palette.mode === "dark" ? "white" : "black"]
          }
        />
        <Legend label='Bruit indésirable' color={(t) => t.palette.error.main} />
      </Box>
    </>
  );
};

const Legend = ({ color, label }) => {
  return (
    <Box display='flex' alignItems='center'>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: (t) =>
            typeof color === "function" ? color(t) : color,
          mr: 1,
        }}
      />
      <Typography variant='caption' color='textSecondary'>
        {label}
      </Typography>
    </Box>
  );
};

Legend.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default AudioLevel;
