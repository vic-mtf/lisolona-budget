import React, { useEffect, useRef, useState } from "react";
import { Box, Divider } from "@mui/material";
import WaveSurfer from "wavesurfer.js";
import PropTypes from "prop-types";
import ListeningTimer from "../../../messaging-box-footer/audio-recording/ListeningTimer";
import ProgressSlider from "../../../messaging-box-footer/audio-recording/ProgressSlider";
import ToggleListingButton from "../../../messaging-box-footer/audio-recording/ToggleListingButton";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import { axios } from "../../../../../../../hooks/useAxios";
import useLocalStoreData from "../../../../../../../hooks/useLocalStoreData";
import VoiceRateButton from "./VoiceRateButton";
import WaveLoader from "../../../../../../../components/WaveLoader";
import SendLoadingButton from "./SendLoadingButton";
import useWaveSurferStyle from "../../../../../../../hooks/useWaveSurferStyle";
import { useMemo } from "react";
import { useCallback } from "react";

const MessageContentVoice = React.forwardRef(({ content: src, id }, ref) => {
  const [getData, setData] = useLocalStoreData();
  const key = useMemo(() => `app.uploads.voices.${id}`, [id]);
  const voiceData = getData(key);

  const [{ loading, ready, waveSurfer, duration }, setUpdateData] = useState({
    loading: voiceData ? false : true,
    ready: voiceData ? true : false,
    waveSurfer: voiceData ? voiceData.waveSurfer : null,
    duration: voiceData ? voiceData.duration : null,
  });
  const waveSurferStyle = useWaveSurferStyle();
  const [sending, setSending] = useState(Boolean(voiceData?.axios));
  const containerRef = useRef(null);

  const updateData = useCallback(
    (data) => {
      setData(key, { ...getData(key), ...data, id });
    },
    [getData, setData, key, id]
  );

  useEffect(() => {
    const container = containerRef.current;
    const mediaElement = waveSurfer?.getMediaElement();
    const onGetDuration = (duration) => {
      setUpdateData((prev) => ({ ...prev, duration, ready: true }));
      updateData({ duration });
    };

    const onFinish = () => {
      if (mediaElement && document.body.contains(mediaElement))
        document.body.removeChild(mediaElement);
      waveSurfer?.un("finish", onFinish);
    };

    if (loading && !voiceData?.loading) {
      updateData({ loading: true, WaveSurfer: null });

      axios
        .get(src, { responseType: "blob" })
        .then((response) => {
          if (response.statusText === "OK") {
            const file = response.data;
            const voice = {
              file,
              url: URL.createObjectURL(file),
              waveSurfer: null,
              duration: 0,
              loading: false,
              container: document.createElement("div"),
            };
            updateData(voice);
            setUpdateData((prev) => ({ ...prev, loading: false }));
          }
        })
        .catch((error) => {
          console.error(error);
          setUpdateData((prev) => ({ ...prev, loading: false }));
          setData(key, null);
        });
    } else if (voiceData?.container && !voiceData?.waveSurfer) {
      voiceData.waveSurfer = WaveSurfer.create({
        url: voiceData.url,
        container: voiceData?.container,
        ...waveSurferStyle,
      });
      setUpdateData((prev) => ({ ...prev, waveSurfer: voiceData.waveSurfer }));
      updateData({});
    }
    waveSurfer?.on("ready", onGetDuration);
    waveSurfer?.on("finish", onFinish);
    waveSurfer?.on("pause", onFinish);
    if (voiceData?.container && container?.children.length === 0) {
      container.appendChild(voiceData.container);
      if (mediaElement) document.body.appendChild(mediaElement);
    }
    return () => {
      console.log("Bonjour le monde");
      waveSurfer?.un("ready", onGetDuration);
    };
  }, [
    src,
    getData,
    setData,
    loading,
    voiceData,
    waveSurfer,
    waveSurferStyle,
    key,
    updateData,
  ]);

  return (
    <Box
      display='flex'
      flexDirection='row'
      gap={2}
      ref={ref}
      height={50}
      alignItems='center'
      mt={1}
      px={1}>
      {sending ? (
        <SendLoadingButton id={id} setSending={setSending} />
      ) : (
        <ToggleListingButton
          waveSurfer={waveSurfer}
          duration={duration}
          disabled={!ready}
        />
      )}
      <Box
        position='relative'
        flexGrow={1}
        maxWidth={180}
        sx={{
          transition: ".2s all",
          position: "relative",
        }}>
        <Box
          sx={{
            opacity: ready ? 1 : 0,
            height: 35,
            y: 1,
            transition: "opacity .5s ease-in-out",
          }}>
          <div ref={containerRef} />
          <ProgressSlider waveSurfer={waveSurfer} duration={duration} />
        </Box>
        {!ready && (
          <WaveLoader
            position='absolute'
            top={0}
            left={0}
            display='flex'
            height={35}
          />
        )}
      </Box>
      <ListeningTimer
        waveSurfer={waveSurfer}
        duration={duration}
        disabled={!ready}
      />
      <Divider
        orientation='vertical'
        flexItem
        variant='middle'
        sx={{ borderWidth: 1.5 }}
      />
      {sending ? (
        <MicNoneOutlinedIcon />
      ) : (
        <VoiceRateButton waveSurfer={waveSurfer} disabled={!ready} />
      )}
    </Box>
  );
});

MessageContentVoice.displayName = "MessageContentVoice";
MessageContentVoice.propTypes = {
  content: PropTypes.string,
  id: PropTypes.string,
};

export default React.memo(MessageContentVoice);
