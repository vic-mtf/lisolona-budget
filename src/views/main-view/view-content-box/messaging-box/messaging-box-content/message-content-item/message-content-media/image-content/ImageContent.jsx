import useLocalStoreData, {
  useSmartKey,
} from "../../../../../../../../hooks/useLocalStoreData";
import { Box, Fade, CardActionArea } from "@mui/material";
import React, { useState, useEffect } from "react";
import ImageLikeSkeleton from "../../../../../../../../components/ImageLikeSkeleton";
import useAxios from "../../../../../../../../hooks/useAxios";
import PropTypes from "prop-types";
import { useSelectorMessage } from "../../../../../../../../hooks/useMessagingContext";
import useSmallScreen from "../../../../../../../../hooks/useSmallScreen";
import ImageContentLoading from "./ImageContentLoading";

const ImageContent = ({ content, id, onClick }) => {
  const { key } = useSmartKey({
    baseKey: `app.key.images.${id}`,
    paths: { key: ["downloads", "uploads"] },
  });
  const [getData, setData] = useLocalStoreData(key);
  const status = useSelectorMessage(id, "status");
  const matches = useSmallScreen();

  const [url, setUrl] = useState(() => getData("src"));

  const [{ data, loading }] = useAxios(
    { url: content, responseType: "blob" },
    { manual: Boolean(url) }
  );

  useEffect(() => {
    if (data && !url) {
      const src = URL.createObjectURL(data);
      setData({ src });
      setUrl(src);
    }
  }, [url, setData, key, data]);

  return (
    <>
      <CardActionArea
        LinkComponent='div'
        disableTouchRipple={matches}
        disableRipple={matches}
        onClick={onClick}
        sx={{
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}>
        {loading || !url ? (
          <ImageLikeSkeleton />
        ) : (
          <Box
            component='img'
            src={url}
            srcSet={url}
            loading='lazy'
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
        )}
      </CardActionArea>
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
          <ImageContentLoading keysPath={key} id={id} />
        </Box>
      </Fade>
    </>
  );
};

ImageContent.propTypes = {
  content: PropTypes.string,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default React.memo(ImageContent);
