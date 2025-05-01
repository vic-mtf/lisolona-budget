import { Box, Fab, IconButton } from "@mui/material";
import React, { useState } from "react";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import PropTypes from "prop-types";
// import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useDispatch } from "react-redux";
import { updateData } from "../../../../../../redux/data/data";
import RecordingViewer from "./RecordingViewer";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import useLocalStoreData from "../../../../../../hooks/useLocalStoreData";
import store from "../../../../../../redux/store";

const AudioRecordingViewer = React.memo(({ waveSurferData }) => {
  const [paused, setPaused] = useState(true);
  const dispatch = useDispatch();
  const [getDate, setData] = useLocalStoreData();

  const cleanRecordingVoice = () => {
    dispatch(
      updateData({
        data: { chatBox: { footer: { recording: false } } },
      })
    );
    const recordPlugin = waveSurferData?.plugins?.record;
    recordPlugin?.destroy();
    waveSurferData.instance = null;
    delete waveSurferData.plugins.record;
  };

  const onRecordEnd = async (blob) => {
    const recordPlugin = waveSurferData?.plugins?.record;
    recordPlugin?.record?.un("record-end", onRecordEnd);
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
    waveSurferData.instance = null;
    delete waveSurferData.plugins.record;
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
            setPaused={setPaused}
            paused={paused}
            waveSurferData={waveSurferData}
          />
        </Box>
        <div>
          <IconButton
            onClick={() => {
              const recordPlugin = waveSurferData?.plugins;
              if (paused) recordPlugin.record?.resumeRecording();
              else recordPlugin.record?.pauseRecording();
              setPaused((paused) => !paused);
            }}>
            {paused ? <MicOutlinedIcon /> : <PauseOutlinedIcon />}
          </IconButton>
        </div>
        <Fab
          color='primary'
          onClick={() => {
            const recordPlugin = waveSurferData?.plugins?.record;
            recordPlugin?.on("record-end", onRecordEnd);
            recordPlugin.stopRecording();
            recordPlugin?.record?.destroy();
          }}>
          <DoneRoundedIcon />
        </Fab>
      </Box>
    </Box>
  );
});

AudioRecordingViewer.propTypes = {
  waveSurferData: PropTypes.shape({
    instance: PropTypes.object,
    plugins: PropTypes.object,
  }),
};

AudioRecordingViewer.displayName = "AudioRecordingViewer";
export default AudioRecordingViewer;
