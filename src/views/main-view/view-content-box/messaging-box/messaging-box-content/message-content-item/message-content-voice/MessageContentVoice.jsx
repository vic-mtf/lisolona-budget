import React from "react";
import { Box, Divider, Fade } from "@mui/material";
import PropTypes from "prop-types";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import useAxios from "../../../../../../../hooks/useAxios";
import useLocalStoreData from "../../../../../../../hooks/useLocalStoreData";
import VoiceRateButton from "./VoiceRateButton";
import WaveLoader from "../../../../../../../components/WaveLoader";
import { useMemo } from "react";
import VoiceListenerView from "../../../../../../../components/VoiceListenerView";
import { useLayoutEffect } from "react";
import UploadingProgressVoiceButton from "./UploadingProgressVoiceButton";
import { useState } from "react";

const MessageContentVoice = React.forwardRef(({ content, id }, ref) => {
  const [getData, setData] = useLocalStoreData();

  const { key } = useMemo(() => {
    const downloadKey = `app.downloads.voices.${id}`;
    const uploadKey = `app.uploads.voices.${id}`;
    const isUpload = Boolean(getData(uploadKey));
    return {
      key: isUpload ? uploadKey : downloadKey,
      isUpload,
    };
  }, [id, getData]);

  const voice = getData(key);
  const audio = useMemo(() => voice?.audio || new Audio(), [voice]);
  const [uploading, setUploading] = useState(Boolean(voice?.request));
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

  useLayoutEffect(() => {
    if (!voice && loading) setData(key, { id, audio });
  }, [loading, voice, key, id, setData, audio]);

  return (
    <Box
      display='flex'
      flexDirection='row'
      gap={2}
      ref={ref}
      height={50}
      alignItems='center'
      maxWidth={400}
      my={1}
      px={1}>
      <Box width='100%' position='relative' mt={2}>
        <Fade
          in={loading}
          unmountOnExit
          appear={false}
          timeout={500}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "red",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
          }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              width: "100%",
            }}>
            <WaveLoader flexGrow={1} />
            <MicNoneOutlinedIcon />
          </div>
        </Fade>
        <Fade
          in={!loading}
          unmountOnExit
          appear={false}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 15,
            }}>
            <VoiceListenerView
              audio={audio}
              disabled={loading}
              src={src}
              file={file}
              rawData={voice?.rawData}
              duration={voice?.duration}
              onGetRawData={({ rawData, duration }) => {
                audio.setAttribute("id", id);
                setData(key, { rawData, ...voice, id, duration, audio });
              }}
              uploading={uploading}
              uploadingProgressButton={
                <UploadingProgressVoiceButton
                  request={voice?.request}
                  setRequest={setUploading}
                />
              }
            />
            <Divider
              orientation='vertical'
              flexItem
              variant='middle'
              sx={{ borderWidth: 1.5 }}
            />
            <VoiceRateButton audio={audio} />
          </div>
        </Fade>
      </Box>
    </Box>
  );
});

MessageContentVoice.displayName = "MessageContentVoice";
MessageContentVoice.propTypes = {
  content: PropTypes.string,
  id: PropTypes.string,
};

export default React.memo(MessageContentVoice);
