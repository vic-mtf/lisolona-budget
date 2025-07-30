import React, { useEffect } from "react";
import PropTypes from "prop-types";
import useLocalStoreData, {
  useSmartKey,
} from "../../../../../../../../hooks/useLocalStoreData";
import useAxios from "../../../../../../../../hooks/useAxios";
import { Box, Fade } from "@mui/material";
import AudioListenerView from "../../../../../../../../components/AudioListenerView";
import { useState } from "react";
import UploadingProgressVoiceButton from "../../message-content-voice/UploadingProgressVoiceButton";
import useMessagingContext, {
  useSelectorMessage,
} from "../../../../../../../../hooks/useMessagingContext";
import AudioPlayerSkeleton from "../../../../../../../../components/AudioPlayerSkeleton";

const AudioContent = ({ content, id }) => {
  const { key } = useSmartKey({
    baseKey: `app.key.audios.${id}`,
    paths: { key: ["downloads", "uploads"] },
  });
  const [getData, setData] = useLocalStoreData(key);
  const [src, setSrc] = useState(() => getData("src"), [getData]);
  const [{ user }] = useMessagingContext();
  const status = useSelectorMessage(id, "status");

  const [{ data }] = useAxios(
    {
      url: new URL(content, import.meta.env.VITE_SERVER_BASE_URL),
      method: "GET",
      responseType: "blob",
    },
    { manual: Boolean(src) }
  );

  useEffect(() => {
    if (data) {
      const src = URL.createObjectURL(data);
      setSrc(src);
      setData({ src });
    }
  }, [data, setSrc, setData]);

  return (
    <Box display='flex' height={60} maxWidth={400} position='relative'>
      <Fade
        in={!src}
        style={{
          width: "100%",
          position: "absolute",
          height: "100%",
          top: 0,
          left: 0,
        }}
        unmountOnExit
        appear={false}>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          gap={2}
          width='100%'>
          <AudioPlayerSkeleton />
        </Box>
      </Fade>
      <Fade
        in={!!src}
        unmountOnExit
        appear={false}
        style={{
          width: "100%",
          position: "absolute",
          height: "100%",
          display: "flex",
          top: 0,
          left: 0,
        }}>
        <AudioListenerView
          url={src}
          id={id}
          targetId={user?.id}
          rateButton
          uploadButton={
            status === "sending" && (
              <UploadingProgressVoiceButton id={id} dataKey={key} />
            )
          }
        />
      </Fade>
    </Box>
  );
};

AudioContent.propTypes = {
  content: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default React.memo(AudioContent);
