import Box from "@mui/material/Box";
import ListSubheader from "@mui/material/ListSubheader";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CardActionArea from "@mui/material/CardActionArea";
import Tooltip from "@mui/material/Tooltip";
import { images } from "./background/images";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import { alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { updateConferenceData } from "../../../../../../redux/conference/conference";
import useLocalStoreData from "../../../../../../hooks/useLocalStoreData";
import { streamSegmenter } from "../../../../../../utils/StreamSegmenter";
import { axios } from "../../../../../../hooks/useAxios";

const ReplaceBackground = () => {
  const [getData, setData] = useLocalStoreData(
    "conference.setup.devices.processedCameraStream.background"
  );
  const dispatch = useDispatch();
  const id = useSelector(
    (store) =>
      store.conference.setup.devices.processedCameraStream.background.id
  );
  const enabled = useSelector(
    (store) =>
      store.conference.setup.devices.processedCameraStream.background.enabled
  );
  const loading = useSelector(
    (store) =>
      store.conference.setup.devices.processedCameraStream.background.loading
  );
  const select = useMemo(() => {
    return items.find((item) => item.id === id);
  }, [id]);

  const handleDownload = async (id) => {
    const background = getData(id);
    if (background) return;
    const item = items.find((item) => item.id === id);
    if (!item) return;
    const { src } = item;
    const controller = new AbortController();
    axiosData.abort = () => {
      axiosData.abort = null;
      controller.abort();
      dispatch(
        updateConferenceData({
          key: "setup.devices.processedCameraStream.background.loading",
          data: false,
        })
      );
    };

    const response = await axios({
      baseURL: src,
      signal: controller.signal,
      responseType: "blob",
      onUploadProgress({ loaded, total }) {
        const uploadProgress = (loaded * 100) / total;
        dispatch(
          updateConferenceData({
            key: "setup.devices.processedCameraStream.background.uploadProgress",
            data: uploadProgress,
          })
        );
      },
      onDownloadProgress({ loaded, total }) {
        const downloadProgress = (loaded * 100) / total;
        dispatch(
          updateConferenceData({
            key: "setup.devices.processedCameraStream.background.downloadProgress",
            data: downloadProgress,
          })
        );
      },
    });
    const blob = await response.data;
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      streamSegmenter.setBackgroundImage(image);
      setData({ [id]: image });

      const key = [
        "setup.devices.processedCameraStream.background.loading",
        "setup.devices.processedCameraStream.background.enabled",
        "setup.devices.processedCameraStream.background.id",
      ];
      const data = [false, true, id];
      dispatch(
        updateConferenceData({
          key,
          data,
        })
      );
    };
    image.src = url;
  };

  const handleSelect = (id) => {
    const key = [];
    const data = [];
    if (axiosData?.abort) axiosData.abort();

    if (id === select?.id) {
      key.push(
        "setup.devices.processedCameraStream.background.enabled",
        "setup.devices.processedCameraStream.background.id"
      );
      data.push(false, null);
    } else {
      key.push(
        "setup.devices.processedCameraStream.background.id",
        "setup.devices.processedCameraStream.background.uploadProgress",
        "setup.devices.processedCameraStream.background.downloadProgress",
        "setup.devices.processedCameraStream.background.enabled",
        "setup.devices.processedCameraStream.background.loading"
      );

      data.push(id, 0, 0, true);
      const background = getData(id);

      if (background) {
        streamSegmenter.setBackgroundImage(background);
        data.push(false);
      } else {
        handleDownload(id);
        data.push(true);
      }
    }
    dispatch(
      updateConferenceData({
        key,
        data,
      })
    );
  };

  return (
    <Box my={2}>
      <ListSubheader
        sx={{
          bgcolor: "transparent",
          backdropFilter: "blur(10px)",
          p: 0,
          px: 1,
        }}>
        {"Modifier l'arrière-plan"}
      </ListSubheader>
      <ImageList cols={4} sx={{ px: 1, m: 0 }}>
        {items.map((image) => (
          <ImageItem
            key={image.id}
            image={image}
            selected={select?.id === image.id && enabled}
            onClick={() => handleSelect(image.id)}
            loading={loading && select?.id === image.id}
          />
        ))}
      </ImageList>
    </Box>
  );
};

const ImageItem = React.forwardRef(
  ({ image, selected, onClick, loading, ...props }, ref) => {
    return (
      <Box
        position='relative'
        component={MenuItem}
        selected={selected}
        sx={{
          p: 0,
          border: (t) =>
            `2.5px solid ${selected ? t.palette.primary.main : "transparent"}`,
          borderRadius: 2.5,
          overflow: "hidden",
        }}>
        <Tooltip title={image.title}>
          <CardActionArea
            onClick={onClick}
            sx={{
              overflow: "hidden",
              position: "relative",
              borderRadius: 2,
            }}>
            <ImageListItem sx={{ aspectRatio: 1 }} {...props} ref={ref}>
              <img src={image.thumbSrc} alt={image.title} loading='lazy' />
            </ImageListItem>
          </CardActionArea>
        </Tooltip>
        {loading && (
          <Box
            position='absolute'
            top={0}
            left={0}
            right={0}
            bottom={0}
            display='flex'
            justifyContent='center'
            alignItems='center'
            zIndex={1}
            sx={{
              borderRadius: 2,
              color: "white",
              bgcolor: (t) => alpha(t.palette.common.black, 0.5),
            }}>
            <Box position='relative'>
              <IconButton
                onClick={onClick}
                sx={{
                  position: "absolute",
                  top: 0,
                  borderRadius: 5,
                  color: "currentColor",
                  left: 0,
                  zIndex: (t) => t.zIndex.tooltip,
                }}>
                <CloseRoundedIcon />
              </IconButton>
              <CircularProgress color='inherit' />
            </Box>
          </Box>
        )}
      </Box>
    );
  }
);

const axiosData = {
  abort: null,
};

const createId = (index) => {
  return `${parseInt(Date.now()) + index}${Math.floor(
    Math.random() * 1000000
  )}`.toString(16);
};

const items = images.map((image, index) => ({
  ...image,
  id: createId(index),
}));

ImageItem.displayName = "ImageItem";
ImageItem.propTypes = {
  image: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
};

// const itemData = [
//   {
//     img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
//     title: "Breakfast",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
//     title: "Burger",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
//     title: "Camera",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
//     title: "Coffee",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
//     title: "Hats",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
//     title: "Honey",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
//     title: "Basketball",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
//     title: "Fern",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
//     title: "Mushrooms",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
//     title: "Tomato basil",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
//     title: "Sea star",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
//     title: "Bike",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
//     title: "Bike",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
//     title: "Breakfast",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
//     title: "Burger",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
//     title: "Camera",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
//     title: "Coffee",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
//     title: "Hats",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
//     title: "Honey",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
//     title: "Basketball",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
//     title: "Fern",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
//     title: "Mushrooms",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
//     title: "Tomato basil",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
//     title: "Sea star",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
//     title: "Bike",
//   },
//   {
//     img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
//     title: "Bike",
//   },
// ];

export default ReplaceBackground;
