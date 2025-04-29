import { Box, Fab, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import PropTypes from "prop-types";
// import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useDispatch } from "react-redux";
import { updateData } from "../../../../../../redux/data/data";
import RecordingViewer from "./RecordingViewer";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import waveSurferInfo from "./waveSurferInfo";
import useLocalStoreData from "../../../../../../hooks/useLocalStoreData";
import store from "../../../../../../redux/store";

const AudioRecordingViewer = React.memo(({ plugins }) => {
  const [paused, setPaused] = useState(true);
  const dispatch = useDispatch();
  const [getDate, setData] = useLocalStoreData();

  const cleanRecordingVoice = () => {
    dispatch(
      updateData({
        data: { chatBox: { footer: { recording: false } } },
      })
    );
    plugins.record?.destroy();
    waveSurferInfo.instantiated = false;
    waveSurferInfo.instance = null;
  };
  const onRecordEnd = async (blob) => {
    plugins?.record?.un("record-end", onRecordEnd);
    const arrayBuffer = await blob.arrayBuffer();
    const file = new Blob([arrayBuffer], { type: "audio/ogg" });
    const voices = [...getDate("voices")];
    const data = store.getState().data;
    const targetId = data.discussionTarget?.id;
    const files = [...(data.chatBox.footer.files[targetId] || [])];

    const voiceData = {
      createdAt: new Date().toJSON(),
      id: Date.now().toString(16),
      type: "voice",
      src: URL.createObjectURL(file),
    };

    files.unshift(voiceData);
    voices.unshift({ file, ...voiceData });
    setData("voices", voices);
    dispatch(
      updateData({
        data: {
          chatBox: {
            footer: { recording: false, files: { [targetId]: files } },
          },
        },
      })
    );
    waveSurferInfo.instantiated = false;
    waveSurferInfo.instance = null;
  };

  return (
    <Box flex={1} display='flex' justifyContent='start' alignItems='end' p={1}>
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        gap={1}
        sx={{ width: { xs: "100%", md: "auto" } }}>
        <div>
          <IconButton onClick={cleanRecordingVoice}>
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
        <Fab
          color='primary'
          onClick={() => {
            plugins?.record?.on("record-end", onRecordEnd);
            plugins.record?.stopRecording();
            waveSurferInfo.instance.plugins.record?.destroy();
          }}>
          <DoneRoundedIcon />
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
