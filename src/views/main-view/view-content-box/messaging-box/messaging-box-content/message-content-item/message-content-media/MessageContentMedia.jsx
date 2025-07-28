import React from "react";
import { alpha, Box } from "@mui/material";
import PropTypes from "prop-types";
import { updateData } from "../../../../../../../redux/data/data";
import ImageContent from "./image-content/ImageContent";
import { useDispatch } from "react-redux";
import VideoContent from "./video-content/VideoContent";

const MessageContentMedia = React.memo(({ content, id, subType }) => {
  //const url = new URL(content, import.meta.env.VITE_SERVER_BASE_URL);
  // const mediaTagRef = useRef();
  const type = subType?.toLowerCase() === "image" ? "img" : "video";
  const dispatch = useDispatch();
  const handleClick = () => {
    const key = [
      "app.actions.messaging.medias.viewer.open",
      "app.actions.messaging.medias.viewer.id",
    ];
    dispatch(updateData({ data: [true, id], key }));
  };

  return (
    <Box
      position='relative'
      sx={{
        width: "auto",
        borderRadius: (theme) => theme.shape.borderRadius / 2,
        overflow: "hidden",
        position: "relative",
        display: "inline-flex",
        p: 0,
        m: 0,
        aspectRatio: 1,
        border: (theme) => `.1px solid ${alpha(theme.palette.divider, 0.02)}`,
        "&::before": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "10%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.5) 0%, " +
            "rgba(0,0,0,0) 100%)",
          zIndex: 1,
        },
      }}>
      <>
        <Box
          width={280}
          height={280}
          minHeight={200}
          minWidth={200}
          component='div'>
          {type === "img" && (
            <ImageContent content={content} id={id} onClick={handleClick} />
          )}
          {type === "video" && (
            <VideoContent content={content} id={id} onClick={handleClick} />
          )}
        </Box>
      </>
    </Box>
  );
});

MessageContentMedia.displayName = "MessageContentMedia";

MessageContentMedia.propTypes = {
  content: PropTypes.string,
  subType: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default MessageContentMedia;
