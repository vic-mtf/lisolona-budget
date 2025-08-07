import React, { useRef } from "react";
import { alpha, Box } from "@mui/material";
import useLocalStoreData from "../../../../../../hooks/useLocalStoreData";
import { useEffect } from "react";
import EnhanceImageButton from "./EnhanceImageButton";
import { ToolbarSide } from "../../CameraMirrorVideo";
import ToggleFilterButton from "./ToggleFilterButton";
import ReplaceBackground from "./ReplaceBackground";
import CamerasList from "./CamerasList";
import ResolutionSwitcher from "./ResolutionSwitcher";

const VideoSetting = () => {
  const [getData, setData] = useLocalStoreData("conference.setup.devices");
  const videoRef = useRef();
  useEffect(() => {
    const stream = getData("camera.processedStream");
    if (stream) {
      videoRef.current.srcObject = stream;
    }
  });
  return (
    <Box sx={{ overflow: "auto" }}>
      <Box
        justifyContent='center'
        alignItems='center'
        display='flex'
        position='sticky'
        top={0}
        bgcolor='transparent'
        sx={{
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          p: 1,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}>
        <Box
          justifyContent='center'
          alignItems='center'
          position='relative'
          display='flex'
          sx={{
            width: { xs: "100%", md: 400 },
            bgcolor: "background.paper",
            borderRadius: 2,
            overflow: "hidden",
          }}>
          <Box
            component='video'
            autoPlay
            muted
            disablePictureInPicture
            disableRemotePlayback
            ref={videoRef}
            sx={{
              aspectRatio: 16 / 9,
              //   width: "100%",
              bgcolor: (t) => alpha(t.palette.common.black, 0.5),
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              objectFit: "cover",
              transform: "scaleX(-1)",
            }}
          />
          <ToolbarSide size='small' />
        </Box>
      </Box>
      <Box sx={{ px: 2 }}>
        <EnhanceImageButton />
        <ToggleFilterButton />
        <CamerasList />
        <ResolutionSwitcher />
        <ReplaceBackground />
      </Box>
    </Box>
  );
};

export default React.memo(VideoSetting);
