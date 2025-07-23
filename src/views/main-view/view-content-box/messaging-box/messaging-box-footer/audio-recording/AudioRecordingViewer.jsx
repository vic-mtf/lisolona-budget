import { Box, Fab, IconButton, Fade } from "@mui/material";
import React, { useState } from "react";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { useDispatch } from "react-redux";
import { updateData } from "../../../../../../redux/data/data";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import useLocalStoreData from "../../../../../../hooks/useLocalStoreData";
import store from "../../../../../../redux/store";
import { useMemo } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import LiveWaveformRecorder from "../../../../../../components/LiveWaveformRecorder";
import AudioRecordingIndicator from "./AudioRecordingIndicator";
import VoiceListenerView from "../../../../../../components/VoiceListenerView";

const AudioRecordingViewer = () => {
  const [stream, setStream] = useState();
  const [paused, setPaused] = useState(false);
  const dispatch = useDispatch();
  const [, setData] = useLocalStoreData();
  const [src, setSrc] = useState();
  const voiceMemo = useMemo(
    () => ({ chunks: [], mediaRecorder: null, src: null, file: null }),
    []
  );

  const cleanRecordingVoice = () => {
    dispatch(
      updateData({
        data: { chatBox: { footer: { recording: false } } },
      })
    );
  };

  const onRecordStop = useCallback(() => {
    const { file, src } = voiceMemo;
    const data = store.getState().data;
    const targetId = data.discussionTarget?.id;
    const files = [...(data.chatBox.footer.files[targetId] || [])];
    const id = Date.now().toString(16);
    const voiceData = {
      createdAt: new Date().toJSON(),
      id,
      type: "voice",
      src,
    };

    files.unshift(voiceData);

    setData(`app.uploads.voices.${id}`, { ...voiceData, file });
    dispatch(
      updateData({
        data: {
          chatBox: {
            footer: { recording: false, files: { [targetId]: files } },
          },
        },
      })
    );
  }, [dispatch, setData, voiceMemo]);

  useEffect(() => {
    let { mediaRecorder } = voiceMemo;
    const startRecording = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceMemo.mediaRecorder = new MediaRecorder(stream);
      setStream(stream);
      voiceMemo.mediaRecorder.start();
    };
    if (!stream) startRecording();
    else if (!mediaRecorder) mediaRecorder = voiceMemo.mediaRecorder;

    const onDataAvailable = ({ data }) => {
      if (data.size > 0) voiceMemo.chunks.push(data);
      if (voiceMemo.src) {
        URL.revokeObjectURL(voiceMemo.src);
        voiceMemo.src = null;
      }
      const file = new Blob(voiceMemo.chunks, { type: "audio/ogg" });
      voiceMemo.src = URL.createObjectURL(file);
      voiceMemo.file = file;
      setSrc(voiceMemo.src);
    };

    mediaRecorder?.addEventListener("stop", onRecordStop);
    mediaRecorder?.addEventListener("dataavailable", onDataAvailable);
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
      mediaRecorder?.removeEventListener("stop", onRecordStop);
      mediaRecorder?.removeEventListener("dataavailable", onDataAvailable);
    };
  }, [stream, voiceMemo, onRecordStop]);

  useEffect(() => {
    stream?.getAudioTracks().forEach((track) => (track.enabled = !paused));
  }, [stream, paused]);

  return (
    <Box
      flex={1}
      display='flex'
      justifyContent='start'
      alignItems='end'
      p={1}
      overflow='hidden'
      height='100%'
      width='100%'>
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
          display='flex'
          sx={{
            width: { xs: "100%", md: 250, lg: 300 },
            height: "100%",
            "& > div:nth-of-type(2)": {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 100,
            },
          }}>
          <Fade
            in={!paused}
            appear={false}
            style={{
              width: "100%",
              position: "relative",
              display: "flex",
            }}>
            <Box display='flex' flexDirection='row' alignItems='center' gap={1}>
              <AudioRecordingIndicator pause={paused} />
              <LiveWaveformRecorder stream={stream} paused={paused} />
            </Box>
          </Fade>
          <Fade in={paused} appear={false} unmountOnExit timeout={500}>
            <Box
              display='flex'
              flexDirection='row'
              alignItems='center'
              gap={1}
              width='100%'>
              <VoiceListenerView src={src} file={voiceMemo.file} />
            </Box>
          </Fade>
        </Box>
        <div>
          <IconButton
            onClick={() => {
              const mediaRecorder = voiceMemo.mediaRecorder;
              setPaused((paused) => {
                if (paused) mediaRecorder?.resume();
                else {
                  mediaRecorder?.requestData();
                  mediaRecorder?.pause();
                }
                return !paused;
              });
            }}>
            {paused ? <MicOutlinedIcon /> : <PauseOutlinedIcon />}
          </IconButton>
        </div>
        <Fab color='primary' onClick={() => voiceMemo.mediaRecorder?.stop()}>
          <DoneRoundedIcon />
        </Fab>
      </Box>
    </Box>
  );
};

AudioRecordingViewer.propTypes = {};

export default React.memo(AudioRecordingViewer);
