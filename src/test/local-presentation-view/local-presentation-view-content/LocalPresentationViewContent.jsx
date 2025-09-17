import Box from "@mui/material/Box";
import useLocalStoreData from "../../../hooks/useLocalStoreData";
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import useVisibleVideoSize from "../../../hooks/useVisibleVideoSize";
import DrawingLayer from "./DrawingLayer";

const LocalPresentationViewContent = () => {
  const videoRef = useRef(null);
  const { width, height, scaleX, scaleY, offsetX, offsetY } =
    useVisibleVideoSize(videoRef);
  const [getData] = useLocalStoreData("conference.setup.devices.screen");
  const enabled = useSelector(
    (store) => store.conference.setup.devices.screen.enabled
  );
  console.log(offsetY);

  useEffect(() => {
    const video = videoRef.current;
    const stream = getData("stream");
    if (enabled && stream && stream !== video.srcObject)
      video.srcObject = stream;
    else video.srcObject = null;
  }, [getData, enabled]);

  return (
    <Box display='flex' flex={1} position='relative'>
      <Box position='absolute' top={0} left={0} right={0} bottom={0}>
        <Box
          component='video'
          autoPlay
          playsInline
          ref={videoRef}
          bgcolor='black'
          muted
          width='100%'
          height='100%'
          sx={{
            objectFit: "contain",
            position: "absolute",
          }}
        />
        <DrawingLayer
          width={width}
          height={height}
          scaleX={scaleX}
          scaleY={scaleY}
          offsetX={offsetX}
          offsetY={offsetY}
        />
      </Box>
    </Box>
  );
};

LocalPresentationViewContent;

export default LocalPresentationViewContent;
