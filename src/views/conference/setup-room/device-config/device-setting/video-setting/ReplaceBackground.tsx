import Box from "@mui/material/Box";
import ListSubheader from "@mui/material/ListSubheader";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CardActionArea from "@mui/material/CardActionArea";
import Tooltip from "@mui/material/Tooltip";
import { images } from "./background/images";
import React, { useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import { alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { updateConferenceData } from "../../../../../../redux/conference/conference";
import useLocalStoreData from "../../../../../../hooks/useLocalStoreData";
import { streamSegmenterMediaPipe } from "../../../../../../utils/StreamSegmenterMediaPipe";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { axios } from "../../../../../../hooks/useAxios";
import { useCallback } from "react";

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
  const customImages = useSelector(
    (store) =>
      store.conference.setup.devices.processedCameraStream.background
        .customImages
  );
  const select = useMemo(() => {
    return (
      items.find((item) => item.id === id) ||
      customImages.find((item) => item.id === id)
    );
  }, [id, customImages]);

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
      streamSegmenterMediaPipe.setBackgroundImage(image);
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
        streamSegmenterMediaPipe.setBackgroundImage(background);
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
  const handleLoadCustomImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const [file] = event.target.files;
      if (file) {
        const src = URL.createObjectURL(file);
        const thumbSrc = await createThumbnail(src);

        const item = {
          id: createId(parseInt(Date.now())),
          src,
          thumbSrc,
          group: "default",
          title: file.name,
        };
        const newCustomImages = [item, ...customImages];
        dispatch(
          updateConferenceData({
            key: [
              "setup.devices.processedCameraStream.background.customImages",
            ],
            data: [newCustomImages],
          })
        );
        const image = new Image();
        image.onload = () => {
          streamSegmenterMediaPipe.setBackgroundImage(image);
          setData({ [item.id]: image });
          const key = [
            "setup.devices.processedCameraStream.background.loading",
            "setup.devices.processedCameraStream.background.enabled",
            "setup.devices.processedCameraStream.background.id",
          ];
          const data = [false, true, item.id];
          dispatch(
            updateConferenceData({
              key,
              data,
            })
          );
        };
        image.src = src;
      }
    };
    input.click();
  }, [dispatch, customImages, setData]);

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
        <ImageListItem
          sx={{ aspectRatio: 1, borderRadius: 2.5, overflow: "hidden" }}>
          <Tooltip title='Sélectionner un arrière-plan personnalisé'>
            <IconButton
              sx={{ width: "100%", height: "100%" }}
              onClick={handleLoadCustomImage}>
              <AddPhotoAlternateOutlinedIcon fontSize='large' />
            </IconButton>
          </Tooltip>
        </ImageListItem>
        {customImages?.map((image) => (
          <ImageItem
            key={image.id}
            image={image}
            selected={select?.id === image.id && enabled}
            onClick={() => handleSelect(image.id)}
            loading={loading && select?.id === image.id}
          />
        ))}
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

const createThumbnail = (imageSrc) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 300;
      canvas.height = 300;
      const ratio = Math.min(img.width / 300, img.height / 300);
      const newWidth = img.width / ratio;
      const newHeight = img.height / ratio;
      const offsetX = (newWidth - 300) / 2;
      const offsetY = (newHeight - 300) / 2;
      ctx.drawImage(img, offsetX, offsetY, 300, 300, 0, 0, 300, 300);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Erreur de chargement de l'image"));
    img.src = imageSrc;
  });
};

ImageItem.displayName = "ImageItem";
export default ReplaceBackground;
