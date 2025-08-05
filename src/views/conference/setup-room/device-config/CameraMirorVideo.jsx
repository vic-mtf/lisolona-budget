import { Box, Typography, alpha, Button, Fade } from "@mui/material";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect } from "react";
import useLocalStoreData from "../../../../hooks/useLocalStoreData";
import { updateConferenceData } from "../../../../redux/conference/conference";

const CameraMirrorVideo = () => {
  const enabled = useSelector(
    (state) => state.conference.setup.devices.camera.enabled
  );
  const deviceId = useSelector(
    (state) => state.conference.setup.devices.camera.deviceId
  );
  const cameraPer = useSelector(
    (state) => state.conference.setup.devices.camera.permission
  );
  const loading = useSelector((state) => state.conference.setup.loading);

  const [getData] = useLocalStoreData("conference.setup.devices");
  const videoRef = useRef(null);

  useEffect(() => {
    const getStream = () => {
      const keys = ["camera.stream", "microphoneAndCamera.stream"];
      for (let i = 0; i < keys.length; i++)
        if (getData(keys[i])) return getData(keys[i]);
      return enabled || null;
    };
    if (deviceId) {
      const video = videoRef.current;
      const stream = getStream();
      if (stream && stream !== video.srcObject) {
        video.srcObject = null;
        video.srcObject = stream;
        video.play();
      } else video.srcObject = null;
      return () => {
        if (video.srcObject) video.srcObject = null;
      };
    }
  }, [deviceId, getData, enabled]);

  return (
    <Box width={{ md: 700 }} position='relative'>
      <Box
        component='video'
        autoPlay
        muted
        disablePictureInPicture
        disableRemotePlayback
        playsInline
        ref={videoRef}
        sx={{
          aspectRatio: { xs: 9 / 16, md: 16 / 9 },
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
      {!enabled && cameraPer === "granted" && (
        <Typography
          position='absolute'
          top={0}
          height='100%'
          width='100%'
          sx={{ color: (t) => t.palette.grey[500] }}
          display='flex'
          alignItems='center'
          justifyContent='center'
          gap={1}
          flexDirection='column'
          zIndex={1}>
          <VideocamOffOutlinedIcon fontSize='large' />
          <span>Votre caméra est désactivée</span>
        </Typography>
      )}
      <DevicePermission />
    </Box>
  );
};

const DevicePermission = () => {
  const cameraPer = useSelector(
    (state) => state.conference.setup.devices.camera.permission
  );
  const microPer = useSelector(
    (state) => state.conference.setup.devices.microphone.permission
  );
  const isPrompt = cameraPer === "prompt" && microPer === "prompt";
  const dispatch = useDispatch();

  return (
    <Fade
      in={Boolean(cameraPer) && cameraPer !== "granted"}
      unmountOnExit
      appear={false}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "column",
        padding: "0 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}>
      <Box>
        <Typography align='center'>
          Voulez-vous être vu et entendu ? Lisolo utilise le micro et la caméra
          de votre appareil pour rendre vos échanges plus immersifs
        </Typography>
        <Button
          variant='contained'
          onClick={() => {
            dispatch(
              updateConferenceData({
                key: [
                  "setup.devices.alertPermission.open",
                  "setup.devices.alertPermission.deviceType",
                ],
                data: [true, isPrompt ? "all" : "camera"],
              })
            );
          }}>
          {isPrompt ? "Activer la caméra et le micro" : "Activer la caméra"}
        </Button>
      </Box>
    </Fade>
  );
};

export default CameraMirrorVideo;
