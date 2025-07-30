import { Box, CardActionArea, Typography, Fade } from "@mui/material";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import { motion } from "framer-motion";
import useLocalStoreData, {
  useSmartKey,
} from "../../../../../../../../hooks/useLocalStoreData";
import PropTypes from "prop-types";
import { useSelectorMessage } from "../../../../../../../../hooks/useMessagingContext";
import { useState } from "react";
import formatTime from "../../../../../../../../utils/formatTime";
import VideoContentLoading from "./VideoContentLoading";
import useAxios from "../../../../../../../../hooks/useAxios";
import { useLayoutEffect } from "react";
import VideoSkeleton from "../../../../../../../../components/VideoSkeleton";

const VideoContent = ({ content, id, onClick }) => {
  const { key } = useSmartKey({
    baseKey: `app.key.videos.${id}`,
    paths: { key: ["downloads", "uploads"] },
  });
  const [getData, setData] = useLocalStoreData(key);
  const status = useSelectorMessage(id, "status");
  const [metadata, setMetadata] = useState(() => getData("metadata"));
  const [{ data, loading }] = useAxios(
    { url: content, responseType: "blob" },
    { manual: Boolean(getData("src")) }
  );
  const [url] = useState(
    () =>
      getData("src") || new URL(content, import.meta.env.VITE_SERVER_BASE_URL)
  );

  useLayoutEffect(() => {
    if (data && !getData("src")) {
      const src = URL.createObjectURL(data);
      setData({ src });
      //setUrl(src);
    }
  }, [data, getData, setData]);

  console.log(metadata);

  return (
    <>
      <Box
        component='video'
        src={url}
        srcSet={url}
        loading='eager'
        poster={metadata?.poster}
        disablePictureInPicture
        muted
        preload='metadata'
        onCanPlay={(e) => {
          if (!metadata?.poster) {
            const video = e.target;
            const duration = video.duration;
            video.currentTime = 1;
            const poster = getPosterImage(video);
            setMetadata({ ...metadata, poster, duration });
            setData({ metadata });
          }
        }}
        sx={{
          objectFit: "cover",
          p: 0,
          m: 0,
          display: "flex",
          height: "100%",
          width: "100%",
          zIndex: 0,
          opacity: metadata ? 1 : 0,
          transition: (t) =>
            t.transitions.create("opacity", {
              easing: t.transitions.easing.easeInOut,
              duration: t.transitions.duration.complex,
            }),
        }}
      />

      {status !== "sending" && metadata && (
        <Box
          height='100%'
          width='100%'
          display='flex'
          justifyContent='center'
          position='absolute'
          alignItems='center'
          top={0}
          left={0}
          right={0}
          bottom={0}
          sx={{ bgcolor: "transparent" }}>
          <CardActionArea
            sx={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}>
            <Box
              component={motion.div}
              className='box'
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              width='100%'
              height='100%'
              display='flex'
              justifyContent='center'
              alignItems='center'
              onClick={onClick}
              color='white'>
              <PlayArrowOutlinedIcon fontSize='large' />
            </Box>
          </CardActionArea>
        </Box>
      )}
      {metadata?.duration && (
        <Box
          position='absolute'
          bottom={0}
          left={0}
          right={0}
          p={0.5}
          px={1}
          color='white'
          // zIndex={100000}
          sx={{ zIndex: (t) => t.zIndex.fab }}>
          <Typography variant='body1'>
            {formatTime({ currentTime: metadata?.duration })}
          </Typography>
        </Box>
      )}
      <Fade
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          background: "transparent",
          backdropFilter: "blur(10px)",
          zIndex: 2,
        }}
        in={status === "sending"}
        appear={false}
        unmountOnExit>
        <Box
          width='100%'
          height='100%'
          component='div'
          sx={{
            display: "flex",
            alignItems: "end",
            flexDirection: "column",
            position: "relative",
          }}>
          <VideoContentLoading keysPath={key} id={id} />
        </Box>
      </Fade>

      <Fade
        in={loading}
        unmountOnExit
        appear={false}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100000,
          height: "100%",
          width: "100%",
        }}>
        <VideoSkeleton />
      </Fade>
    </>
  );
};

const getPosterImage = (video) => {
  if (!video) return null;
  video.crossOrigin = "anonymous";
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  return canvas.toDataURL("image/png");
};

VideoContent.propTypes = {
  content: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onClick: PropTypes.func,
};

export default VideoContent;
