import useLocalStoreData from "../../../../../../../../hooks/useLocalStoreData";
import { Box } from "@mui/material";
import React, { useState, useMemo, useEffect } from "react";
import ImageLikeSkeleton from "../../../../../../../../components/ImageLikeSkeleton";
import useAxios from "../../../../../../../../hooks/useAxios";
import PropTypes from "prop-types";

const ImageContent = ({ content, id }) => {
  const [getData, setData] = useLocalStoreData();
  const { key } = useMemo(() => {
    const downloadKey = `app.downloads.images.${id}`;
    const uploadKey = `app.uploads.images.${id}`;
    const isUpload = Boolean(getData(uploadKey));
    return {
      key: isUpload ? uploadKey : downloadKey,
      isUpload,
    };
  }, [id, getData]);
  // const key = `app.downloads.images.${id}`;
  const [url, setUrl] = useState(() => getData(key)?.src);
  const [{ data, loading }] = useAxios(
    { url: content, responseType: "blob" },
    { manual: Boolean(url) }
  );

  useEffect(() => {
    if (data && !url) {
      const src = URL.createObjectURL(data);
      setData(key, { src });
      setUrl(src);
    }
  }, [url, setData, key, data]);

  return (
    <>
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
    </>
  );
};

ImageContent.propTypes = {
  content: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default React.memo(ImageContent);
