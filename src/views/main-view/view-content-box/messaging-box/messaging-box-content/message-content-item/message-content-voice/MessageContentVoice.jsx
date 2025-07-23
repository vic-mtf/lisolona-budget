import React, { useEffect, useRef, useState } from "react";
import { Box, Divider } from "@mui/material";
import WaveSurfer from "wavesurfer.js";
import PropTypes from "prop-types";
import ListeningTimer from "../../../messaging-box-footer/audio-recording/ListeningTimer";
import ProgressSlider from "../../../messaging-box-footer/audio-recording/ProgressSlider";
import ToggleListingButton from "../../../messaging-box-footer/audio-recording/ToggleListingButton";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import useAxios, { axios } from "../../../../../../../hooks/useAxios";
import useLocalStoreData from "../../../../../../../hooks/useLocalStoreData";
import VoiceRateButton from "./VoiceRateButton";
import WaveLoader from "../../../../../../../components/WaveLoader";
import SendLoadingButton from "./SendLoadingButton";
import useWaveSurferStyle from "../../../../../../../hooks/useWaveSurferStyle";
import { useMemo } from "react";
import VoiceListenerView from "../../../../../../../components/VoiceListenerView";
import { useLayoutEffect } from "react";

const MessageContentVoice = React.forwardRef(({ content, id }, ref) => {
  const [getData, setData] = useLocalStoreData();
  const key = useMemo(() => `app.uploads.voices.${id}`, [id]);
  const voice = getData(key);
  const audioRef = useRef(null);
  const [{ loading, data }] = useAxios(
    { url: content, responseType: "blob" },
    {
      manual: Boolean(voice?.file),
    }
  );

  const src = useMemo(() => {
    if (voice && !voice?.src && data) voice.src = URL.createObjectURL(data);
    return voice?.src || null;
  }, [voice, data]);

  const file = useMemo(() => {
    if (voice && !voice?.file && data) voice.file = data;
    return voice?.file || null;
  }, [voice, data]);

  console.log(file, src);

  useLayoutEffect(() => {
    if (!voice && loading) setData(key, { id });
  }, [loading, voice, key, id, setData]);

  return (
    <Box
      display='flex'
      flexDirection='row'
      gap={2}
      ref={ref}
      height={50}
      alignItems='center'
      maxWidth={400}
      mt={1}
      px={1}>
      {loading ? (
        <>
          <WaveLoader flexGrow={1} />
        </>
      ) : (
        <VoiceListenerView
          audioRef={audioRef}
          disabled={loading}
          src={src}
          file={file}
          rawData={voice?.rawData}
          onGetRawData={(rawData) => setData(key, { rawData, ...voice, id })}
        />
      )}

      <Divider
        orientation='vertical'
        flexItem
        variant='middle'
        sx={{ borderWidth: 1.5 }}
      />
      {loading ? (
        <MicNoneOutlinedIcon />
      ) : (
        <VoiceRateButton audioRef={audioRef} />
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
