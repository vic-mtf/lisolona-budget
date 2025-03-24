import React, { useCallback, useState } from "react";
import { Divider, Modal } from "@mui/material";
import MediaViewerHeader from "./MediaViewerHeader";
import { useSelector } from "react-redux";
import store from "../../../../redux/store";
import { updateData } from "../../../../redux/data/data";
import MediaViewerContent from "./media-viewer-content/MediaViewerContent";

const MediaView = React.memo(() => {
  const [zoom, setZoom] = useState(false);
  const open = useSelector(
    (store) => store.data.app.actions.messaging.medias.viewer.open
  );
  const handleClose = useCallback(() => {
    const key = "app.actions.messaging.medias.viewer.open";
    store.dispatch(updateData({ key, data: false }));
    setZoom(false);
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      component='div'
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <>
        <MediaViewerHeader
          onClose={handleClose}
          toggleZoom={() => setZoom((z) => !z)}
          zoom={zoom}
        />
        <Divider />
        <MediaViewerContent zoom={zoom} />
      </>
    </Modal>
  );
});

MediaView.displayName = "MediaView";
export default MediaView;
