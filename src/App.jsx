import {
  Divider,
  Fab,
  Stack,
  Toolbar,
  Box,
  Typography,
  createSvgIcon,
  SvgIcon,
  IconButton,
} from "@mui/material";
import "./styles/App.css";
// import { useState } from "react";
import { useState } from "react";
import PresentationView from "./views/presentation-view/PresentationView";

import { useEffect } from "react";
import ScreenShareOutlinedIcon from "@mui/icons-material/ScreenShareOutlined";
import StopScreenShareOutlinedIcon from "@mui/icons-material/StopScreenShareOutlined";
import DiscussionList from "./views/list/DiscussionList";
import MessageList from "./views/message/MessageList";
import { useRef } from "react";

function App() {
  const [stream, setStream] = useState(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const [track] = stream?.getTracks() || [];
    if (track) {
      track.onended = () => setStream(null);
    }
    return () => {
      if (track) {
        track.onended = null;
        const tracks = stream?.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }
    };
  }, [stream]);

  return (
    <Stack divider={<Divider />} display='flex' flex={1} width='100%'>
      {/* <PresentationView stream={stream} streamRef={streamRef} /> */}
      <Box display='flex' flex={1} overflow='hidden'>
        <Box
          width={400}
          display='flex'
          height='100%'
          overflow='hidden'
          flexDirection='column'
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}>
          <Toolbar>
            <Typography variant='h6'>Discussions</Typography>
          </Toolbar>
          <Divider />
          <Box
            display='flex'
            flex={1}
            flexGrow={1}
            overflow='hidden'
            position='relative'>
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                overflow: "hidden",
              }}>
              <DiscussionList />
            </div>
          </Box>
        </Box>
        <Box flexGrow={1}>
          <MessageList />
        </Box>
      </Box>
      <Toolbar>
        {/* <Fab
          onClick={handlerStream}
          variant='extended'
          color='default'
          size='small'
          sx={{ m: "auto" }}>
          <PreviewIcon />
        </Fab> */}
        <Fab
          onClick={async () => {
            if (stream) {
              const tracks = stream.getTracks();
              tracks.forEach((track) => {
                track.stop();
              });
            } else
              setStream(
                await navigator.mediaDevices.getDisplayMedia({
                  video: true,
                })
              );
          }}
          variant='extended'
          color={stream ? "primary" : "default"}
          size='small'
          sx={{ m: "auto" }}>
          {stream ? (
            <StopScreenShareOutlinedIcon />
          ) : (
            <ScreenShareOutlinedIcon />
          )}
        </Fab>
      </Toolbar>
    </Stack>
  );
}

export default App;
