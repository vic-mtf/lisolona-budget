import {
  Box,
  Typography,
  alpha,
  Button,
  Fade,
  ImageListItemBar,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
} from "@mui/material";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect, useState } from "react";
import useLocalStoreData from "../../../../hooks/useLocalStoreData";
import { updateConferenceData } from "../../../../redux/conference/conference";
import LensBlurOutlinedIcon from "@mui/icons-material/LensBlurOutlined";
import BlurOffOutlinedIcon from "@mui/icons-material/BlurOffOutlined";
import LayersClearOutlinedIcon from "@mui/icons-material/LayersClearOutlined";
import { streamSegmenterMediaPipe } from "../../../../utils/StreamSegmenterMediaPipe";

const CameraMirrorVideo = () => {
  const enabled = useSelector(
    (store) => store.conference.setup.devices.camera.enabled
  );
  const deviceId = useSelector(
    (store) => store.conference.setup.devices.camera.deviceId
  );
  const cameraPer = useSelector(
    (store) => store.conference.setup.devices.camera.permission
  );
  const loading = useSelector((store) => store.conference.setup.loading);

  const [getData] = useLocalStoreData("conference.setup.devices");
  const videoRef = useRef(null);

  useEffect(() => {
    if (deviceId) {
      const video = videoRef.current;
      const stream = getData("camera.processedStream"); //|| getData("camera.stream");
      if (enabled && stream && stream !== video.srcObject)
        video.srcObject = stream;
      else video.srcObject = null;
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
          bgcolor: (t) => alpha(t.palette.common.black, 0.9),
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          objectFit: "cover",
          transform: "scaleX(-1)",
        }}
      />
      <Box
        position='absolute'
        top={0}
        height='100%'
        width='100%'
        sx={{ color: (t) => t.palette.grey[400] }}
        display='flex'
        alignItems='center'
        justifyContent='center'
        gap={1}
        flexDirection='column'
        zIndex={0}>
        {!enabled && cameraPer === "granted" && !loading && (
          <Typography color='currentColor' m='auto'>
            <div style={{ textAlign: "center" }}>
              <VideocamOffOutlinedIcon fontSize='large' />
            </div>
            <span>Votre caméra est désactivée</span>
          </Typography>
        )}
        {!cameraPer && loading && (
          <Typography color='currentColor'>
            <span>Détection de la caméra...</span>
          </Typography>
        )}
      </Box>
      <DevicePermission />
      <ToolbarSide name='Vous' />
    </Box>
  );
};

export const ToolbarSide = ({ size, name }) => {
  const loading = useSelector((store) => store.conference.setup.loading);
  const blur = useSelector(
    (store) => store.conference.setup.devices.processedCameraStream.blurred
  );
  const background = useSelector(
    (store) => store.conference.setup.devices.processedCameraStream.background
  );

  const dispatch = useDispatch();

  return (
    <>
      <ImageListItemBar
        sx={{
          p: 0.5,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
        }}
        subtitle={name}
        position='top'
        actionIcon={
          <Tooltip
            title={
              background.enabled
                ? "Supprimer l'arrière-plan"
                : blur
                ? "Supprimer le floutage"
                : "Flouter l'arrière-plan"
            }>
            <div>
              <IconButton
                disabled={loading}
                sx={{ color: "white" }}
                size={size}
                onClick={() => {
                  let key;
                  let data;
                  if (background.enabled) {
                    key = [
                      "setup.devices.processedCameraStream.background.enabled",
                      "setup.devices.processedCameraStream.background.id",
                    ];
                    data = [false, null];
                  } else {
                    key = "setup.devices.processedCameraStream.blurred";
                    data = !blur;
                  }
                  dispatch(updateConferenceData({ key, data }));
                }}>
                {background.enabled ? (
                  <LayersClearOutlinedIcon fontSize={size} />
                ) : (
                  <>
                    {blur ? (
                      <BlurOffOutlinedIcon fontSize={size} />
                    ) : (
                      <LensBlurOutlinedIcon fontSize={size} />
                    )}
                  </>
                )}
              </IconButton>
            </div>
          </Tooltip>
        }
        actionPosition='right'
      />
      <ImageListItemBar
        sx={{
          //p: 0.5,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
        }}
        subtitle={<DownloadSegmentModelEffect />}
        position='bottom'
      />
    </>
  );
};

const DownloadSegmentModelEffect = () => {
  const backgroundDownloadProgress = useSelector(
    (store) =>
      store.conference.setup.devices.processedCameraStream.background
        .downloadProgress
  );
  const backgroundLoading = useSelector(
    (store) =>
      store.conference.setup.devices.processedCameraStream.background.loading
  );

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(
    () => streamSegmenterMediaPipe.getModelStats().loadingModel
  );
  useEffect(() => {
    streamSegmenterMediaPipe.downloadProgressModel = (progress) => {
      if (!loading) setLoading(true);
      setProgress(progress * 100);
    };
    streamSegmenterMediaPipe.loadedModel = (data) => {
      setLoading(!data);
    };
    return () => {
      streamSegmenterMediaPipe.downloadProgressModel = null;
    };
  }, [loading]);

  return (
    <>
      {loading && (
        <LinearProgress
          value={progress}
          variant='determinate'
          sx={{ position: "absolute", bottom: 0, width: "100%", left: 0 }}
          color='inherit'
        />
      )}
      {backgroundLoading && (
        <LinearProgress
          value={backgroundDownloadProgress}
          variant='determinate'
          sx={{ position: "absolute", bottom: 0, width: "100%", left: 0 }}
          color='inherit'
        />
      )}
    </>
  );
};

const DevicePermission = () => {
  const cameraPer = useSelector(
    (store) => store.conference.setup.devices.camera.permission
  );
  const microPer = useSelector(
    (store) => store.conference.setup.devices.microphone.permission
  );
  const loading = useSelector((store) => store.conference.setup.loading);
  const isPrompt = cameraPer === "prompt" && microPer === "prompt";
  const isDenied = cameraPer === "denied";
  const dispatch = useDispatch();

  return (
    <Fade
      in={Boolean(cameraPer) && cameraPer !== "granted" && !loading}
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
        color: "white",
      }}>
      <Box>
        <Typography align='center' color='currentColor'>
          Voulez-vous être vu et entendu ? Lisolo utilise le micro et la caméra
          de votre appareil pour rendre vos échanges plus immersifs
        </Typography>
        {!isDenied ? (
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
        ) : (
          <Alert severity='error'>
            <Typography variant='caption' color='currentColor'>
              {`Vous avez refusé l'accès ${
                microPer === "denied"
                  ? "au micro et à la caméra"
                  : "à la caméra"
              }. Voir les paramètres de votre navigateur pour activer l'accès.`}
            </Typography>
          </Alert>
        )}
      </Box>
    </Fade>
  );
};

export default CameraMirrorVideo;
