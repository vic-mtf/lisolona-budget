import React, { useRef } from "react";
import { alpha, Box, CardActionArea } from "@mui/material";
import PropTypes from "prop-types";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import { motion } from "framer-motion";
import useSmallScreen from "../../../../../../../hooks/useSmallScreen";
import { updateData } from "../../../../../../../redux/data/data";
import store from "../../../../../../../redux/store";

const MessageContentMedia = React.memo(({ content, id, subType }) => {
  const url = new URL(content, import.meta.env.VITE_SERVER_BASE_URL);
  const mediaTagRef = useRef();
  const type = subType === "IMAGE" ? "img" : "video";
  const matches = useSmallScreen();

  return (
    <Box>
      <CardActionArea
        LinkComponent='div'
        disableTouchRipple={matches}
        disableRipple={matches}
        onClick={() => {
          const key = [
            "app.actions.messaging.medias.viewer.open",
            "app.actions.messaging.medias.viewer.id",
          ];
          store.dispatch(updateData({ data: [true, id], key }));
        }}
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
        <Box width={280} height={280} minHeight={200} minWidth={200}>
          <Box
            component={type}
            src={url}
            srcSet={url}
            loading='eager'
            ref={mediaTagRef}
            muted
            preload='metadata'
            sx={{
              objectFit: "cover",
              p: 0,
              m: 0,
              transition: "opacity .2s ease-in-out",
              display: "flex",
              height: "100%",
              width: "100%",
            }}
          />
        </Box>

        <Box
          height='100%'
          width='100%'
          display='flex'
          justifyContent='center'
          position='absolute'
          alignItems='center'
          sx={{ bgcolor: "transparent", backdropFilter: "blur(0.6px)" }}>
          {type === "video" && (
            <motion.div
              className='box'
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "50%",
                  bgcolor: (theme) => alpha(theme.palette.common.black, 0.3),
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.common.black, 0.2),
                  },
                }}>
                <PlayArrowOutlinedIcon fontSize='large' />
              </Box>
            </motion.div>
          )}
        </Box>
      </CardActionArea>
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
