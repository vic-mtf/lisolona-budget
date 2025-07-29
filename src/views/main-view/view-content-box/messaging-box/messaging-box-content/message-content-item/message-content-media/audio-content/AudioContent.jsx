import React, { useEffect } from "react";
import PropTypes from "prop-types";
import useLocalStoreData, {
  useSmartKey,
} from "../../../../../../../../hooks/useLocalStoreData";
import useAxios from "../../../../../../../../hooks/useAxios";
import { LinearProgress, Box, Fade, IconButton } from "@mui/material";
import AudioListenerView from "../../../../../../../../components/AudioListenerView";
import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined";
import { useState } from "react";
import UploadingProgressVoiceButton from "../../message-content-voice/UploadingProgressVoiceButton";
import { useSelectorMessage } from "../../../../../../../../hooks/useMessagingContext";

const AudioContent = ({ content, id }) => {
  const { key } = useSmartKey({
    baseKey: `app.key.audios.${id}`,
    paths: { key: ["downloads", "uploads"] },
  });
  const [getData, setData] = useLocalStoreData(key);
  const [src, setSrc] = useState(() => getData("src"), [getData]);
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
          <IconButton disabled>
            <AudioFileOutlinedIcon />
          </IconButton>

          <LinearProgress
            color='inherit'
            variant='indeterminate'
            sx={{
              borderRadius: 0.5,
              width: "100%",
              // "& .MuiLinearProgress-bar": {
              //   bgcolor: (t) => t.palette.primary.main,
              // },
            }}
          />
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
