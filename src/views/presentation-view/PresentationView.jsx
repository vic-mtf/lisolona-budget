import { Box, Divider, Toolbar, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useRef } from "react";
import { useEffect } from "react";
import DrawingLayer from "./DrawingLayer";
import AutoSizeContainer from "./AutoSizeContainer";
import AnnotationButton from "./AnnotationButton";
import { useState } from "react";

const PresentationView = ({ stream, streamRef }) => {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState("ephemeral");
  const [color, setColor] = useState("#2979ff");

  const rootRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
      return () => (video.srcObject = null);
    }
  }, [stream]);

  return (
    <Box
      display='flex'
      flex={1}
      overflow='hidden'
      position='relative'
      flexDirection='row'>
      <Box
        display='flex'
        flex={1}
        overflow='hidden'
        // bgcolor='pink'
        position='relative'
        flexDirection='column'>
        <Toolbar height={50} width='100%'>
          <Typography variant='h6' mr={2}>
            Présentation
          </Typography>
          <AnnotationButton
            mode={mode}
            color={color}
            active={active}
            onChange={(event, { id, type }) => {
              event?.preventDefault();
              if (type === "mode") setMode(id);
              if (type === "color") setColor(id);
            }}
            onToggleActive={() => setActive((v) => !v)}
          />
        </Toolbar>
        <Divider />
        <Box position='relative' display='flex' flex={1}>
          <Box
            display='flex'
            height='100%'
            width='100%'
            ref={rootRef}
            flex={1}
            position='absolute'
            top={0}
            bottom={0}
            overflow='hidden'
            justifyContent='center'
            alignItems='center'
            sx={{
              "& > video": {
                minWidth: 0,
                minHeight: 0,
                maxWidth: "100%",
                maxHeight: "100%",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                aspectRatio: 16 / 9,
                zIndex: 0,
                objectFit: "contain",
                opacity: 0,
                // bgcolor: "tomato",
              },
            }}>
            <video
              ref={videoRef}
              id='presentation-video'
              loop
              muted
              autoPlay></video>
            <Box
              display='flex'
              flex={1}
              justifyContent='center'
              alignItems={1}
              sx={{
                "& > .stage-container": {
                  overflow: "hidden",
                  // "&> *": {
                  //   overflow: "hidden",
                  // },
                },
              }}>
              <AutoSizeContainer rootRef={rootRef}>
                {({ width, height, ratio }) => (
                  <DrawingLayer
                    width={width}
                    height={height}
                    ratio={ratio}
                    videoRef={videoRef}
                    streamRef={streamRef}
                    mode={active ? mode : null}
                    color={color}
                  />
                )}
              </AutoSizeContainer>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

PresentationView.propTypes = {
  users: PropTypes.array,
  stream: PropTypes.object,
  open: PropTypes.bool,
  streamRef: PropTypes.object,
};

export default PresentationView;
