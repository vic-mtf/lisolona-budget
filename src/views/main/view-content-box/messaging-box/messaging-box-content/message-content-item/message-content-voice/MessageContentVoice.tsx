import React from "react";
import { Box, Divider, Fade } from "@mui/material";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import useAxios from "../../../../../../../hooks/useAxios";
import useLocalStoreData, {
  useSmartKey,
} from "../../../../../../../hooks/useLocalStoreData";
import VoiceRateButton from "./VoiceRateButton";
import WaveLoader from "../../../../../../../components/WaveLoader";
import { useMemo } from "react";
import VoiceListenerView from "../../../../../../../components/VoiceListenerView";
import { useLayoutEffect } from "react";
import UploadingProgressVoiceButton from "./UploadingProgressVoiceButton";
import useMessagingContext, {
  useSelectorMessage,
} from "../../../../../../../hooks/useMessagingContext";

const MessageContentVoice = React.forwardRef(({ content, id }, ref) => {
  const { key } = useSmartKey({
    baseKey: `app.key.voices.${id}`,
    paths: { key: ["downloads", "uploads"] },
  });
  const [{ user }] = useMessagingContext();
  const status = useSelectorMessage(id, "status");
  const [getData, setData] = useLocalStoreData(key);

  const voice = getData();
  const audio = useMemo(() => voice?.audio || new Audio(), [voice]);

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
    if (!voice && loading) setData({ id, audio });
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
              id={id}
              targetId={user?.id}
              onGetRawData={({ rawData, duration }) => {
                audio.setAttribute("id", id);
                setData({ rawData, ...voice, id, duration, audio });
              }}
              uploading={status === "sending"}
              uploadingProgressButton={
                <UploadingProgressVoiceButton id={id} dataKey={key} />
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
export default React.memo(MessageContentVoice);
