import { Box, Fab, IconButton } from "@mui/material";
import React, { useState } from "react";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import PropTypes from "prop-types";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useDispatch } from "react-redux";
import { updateData } from "../../../../../../redux/data/data";
import RecordingViewer from "./RecordingViewer";
import waveSurferInfo from "./waveSurferInfo";

const AudioRecordingViewer = React.memo(({ plugins }) => {
  const [paused, setPaused] = useState(true);
  const dispatch = useDispatch();

  console.log("Bonjour les amis");

  return (
    <Box flex={1} display='flex' justifyContent='end' alignItems='end' p={1}>
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        gap={1}
        sx={{ width: { xs: "100%", md: "auto" } }}>
        <div>
          <IconButton
            onClick={() => {
              dispatch(
                updateData({
                  data: { chatBox: { footer: { recording: false } } },
                })
              );
              plugins.record?.destroy();
              waveSurferInfo.instantiated = false;
              waveSurferInfo.instance = null;
            }}>
            <ClearOutlinedIcon />
          </IconButton>
        </div>
        <Box
          position='relative'
          sx={{
            width: { xs: "100%", md: 250, lg: 300 },
            height: "100%",
          }}>
          <RecordingViewer
            plugins={plugins}
            setPaused={setPaused}
            paused={paused}
          />
        </Box>
        <div>
          <IconButton
            onClick={() => {
              if (paused) plugins.record?.resumeRecording();
              else plugins.record?.pauseRecording();
              setPaused((paused) => !paused);
            }}>
            {paused ? <MicOutlinedIcon /> : <PauseOutlinedIcon />}
          </IconButton>
        </div>
        <Fab color='primary' onClick={null}>
          <SendOutlinedIcon />
        </Fab>
      </Box>
    </Box>
  );
});

AudioRecordingViewer.propTypes = {
  plugins: PropTypes.shape({
    record: PropTypes.object,
  }),
};

AudioRecordingViewer.displayName = "AudioRecordingViewer";
export default AudioRecordingViewer;
