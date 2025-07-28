import PropTypes from "prop-types";
import { Box, CircularProgress } from "@mui/material";
import ZoomViewerContent from "./ZoomViewerContent";
import useLocalStoreData, {
  useSmartKey,
} from "../../../../../hooks/useLocalStoreData";
import useAxios from "../../../../../hooks/useAxios";
import { useState, useLayoutEffect } from "react";

const ImageContent = ({ content, mode = "normal", id }) => {
  const [getData, setData] = useLocalStoreData();

  const { key } = useSmartKey({
    baseKey: `app.key.images.${id}`,
    paths: { key: ["downloads", "uploads"] },
  });
  const [url, setUrl] = useState(() => getData(key)?.src);
  // console.log("url => ", url);
  const [{ data, loading }] = useAxios(
    { url: content, responseType: "blob" },
    { manual: Boolean(url) }
  );

  useLayoutEffect(() => {
    if (data && !url) {
      const src = URL.createObjectURL(data);
      setData(key, { src });
      setUrl(src);
    }
  }, [data, url, setData, key]);

  return (
    <Box
      position='absolute'
      display='flex'
      height='100%'
      width='100%'
      top={0}
      left={0}
      justifyContent='center'
      alignItems='center'
      overflow='hidden'
      component={ZoomViewerContent}
      mode={mode}>
      {loading ? (
        <CircularProgress color='inherit' />
      ) : (
        <img
          src={url}
          loading='lazy'
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      )}
    </Box>
  );
};

ImageContent.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]),
  mode: PropTypes.oneOf(["normal", "zoom"]),
  id: PropTypes.string.isRequired,
};

export default ImageContent;
