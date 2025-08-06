import {
  Dialog,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Toolbar,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateConferenceData } from "../../../../redux/conference/conference";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useCallback, useEffect, useMemo, useRef } from "react";
import useLocalStoreData from "../../../../hooks/useLocalStoreData";
import getDevices from "../../../../utils/getDevices";
import { useNotifications } from "@toolpad/core/useNotifications";
import { streamSegmenter } from "../../../../utils/StreamSegmenter";

const DeviceAlertPermission = () => {
  const [getData, setData] = useLocalStoreData("conference.setup.devices");
  const clickableRef = useRef(true);
  const notifications = useNotifications();
  const cameraPer = useSelector(
    (store) => store.conference.setup.devices.camera.permission
  );
  const microPer = useSelector(
    (store) => store.conference.setup.devices.microphone.permission
  );
  const open = useSelector(
    (store) => store.conference.setup.devices.alertPermission.open
  );
  const deviceType = useSelector(
    (store) => store.conference.setup.devices.alertPermission.deviceType
  );
  const dispatch = useDispatch();

  const onClose = useCallback(
    () =>
      dispatch(
        updateConferenceData({
          key: "setup.devices.alertPermission.open",
          data: false,
        })
      ),
    [dispatch]
  );

  const showErrorMessage = useCallback(
    (name, type) => {
      const message = mediaStreamErrorMessages(type)[name || "UnknownError"];
      notifications.show(
        <span style={{ display: "inline-flex", maxWidth: 400 }}>
          {message}
        </span>,
        {
          severity: "error",
        }
      );
    },
    [notifications]
  );

  const createStream = useCallback(
    async (type, constraints) => {
      if (["microphone", "camera"].includes(type))
        try {
          const isAudio = type === "microphone";
          const isVideo = type === "camera";
          const stream = await navigator.mediaDevices.getUserMedia({
            video: isVideo ? constraints?.video || true : false,
            audio: isAudio ? constraints?.audio || true : false,
          });
          if (isVideo) {
            const processedStream = await streamSegmenter.initStream(stream);
            setData(type, { stream, processedStream });
          } else setData(type, { stream });

          const { microphones, cameras, speakers, screens } =
            await getDevices();
          const defaultDevices = {
            microphone: microphones[0],
            camera: cameras[0],
            speaker: speakers[0],
            screen: screens[0],
          };

          const key = ["setup.devices.screens"];
          const data = [screens];

          if (isAudio) {
            key.push(
              "setup.devices.microphones",
              "setup.devices.speakers",
              "setup.devices.microphone.enabled"
            );
            data.push(microphones, speakers, true);
          }
          if (isVideo) {
            key.push("setup.devices.cameras", "setup.devices.camera.enabled");
            data.push(cameras, true);
          }

          Object.keys(defaultDevices).forEach((k) => {
            const obj = defaultDevices[k];
            if (obj)
              Object.keys(obj).forEach((j) => {
                key.push(`setup.devices.${k}.${j}`);
                data.push(obj[j]);
              });
          });
          dispatch(updateConferenceData({ data, key }));
        } catch (error) {
          console.error(error);
          showErrorMessage(error.name, type);
        }
      onClose();
    },
    [setData, dispatch, onClose, showErrorMessage]
  );

  const message = useMemo(
    () =>
      ({
        all: "Autoriser la caméra et le micro",
        camera: "Autoriser la caméra",
        microphone: "Autoriser le micro",
      }[deviceType]),
    [deviceType]
  );

  useEffect(() => {
    const getStream = () => {
      const keys = ["microphone.stream", "camera.stream"];
      for (let i = 0; i < keys.length; i++)
        if (getData(keys[i])) return getData(keys[i]);
      return null;
    };
    if (microPer && cameraPer) {
      const stream = getStream();
      const isVideoTrack = stream?.getVideoTracks()?.length > 0;
      const isMicroTrack = stream?.getAudioTracks()?.length > 0;
      if (microPer === "granted" && !isMicroTrack) createStream("microphone");
      if (cameraPer === "granted" && !isVideoTrack) createStream("camera");
      const isMicroGranted = microPer === "granted";
      const isCameraGranted = cameraPer === "granted";
      if (!isMicroGranted) {
        dispatch(
          updateConferenceData({
            key: "setup.devices.microphone.enabled",
            data: false,
          })
        );
        setData("microphone", { stream: null });
      }
      if (!isCameraGranted) {
        dispatch(
          updateConferenceData({
            key: "setup.devices.camera.enabled",
            data: false,
          })
        );
        setData("camera", { stream: null });
      }
    }
  }, [microPer, cameraPer, createStream, getData, dispatch, setData]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Toolbar>
        <IconButton
          edge='start'
          color='inherit'
          aria-label='close'
          onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
        <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
          {"Demande d'autorisation"}
        </Typography>
      </Toolbar>
      <Box overflow='hidden' position='relative' flex={1}>
        <DialogContentText component='div' mx={2} variant='body2'>
          Lisolo souhaite accéder au microphone et à la caméra de votre appareil
          afin d’activer les fonctionnalités audio et vidéo. Vous gardez le
          contrôle : désactivez le micro et la caméra quand vous le souhaitez
        </DialogContentText>
      </Box>

      {message && (
        <DialogActions>
          <Button
            onClick={async () => {
              if (clickableRef.current) {
                clickableRef.current = false;
                try {
                  const stream = await navigator.mediaDevices.getUserMedia({
                    audio:
                      deviceType === "all" ? true : deviceType === "microphone",
                    video:
                      deviceType === "all" ? true : deviceType === "camera",
                  });
                  stream.getTracks().forEach((track) => {
                    track.stop();
                  });
                } catch (err) {
                  console.error(err);
                  showErrorMessage(err.name, deviceType);
                }

                clickableRef.current = true;
                onClose();
              }
            }}>
            {message}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

const mediaStreamErrorMessages = (deviceType = "all") => ({
  NotAllowedError: `Accès ${
    deviceType === "all"
      ? "au micro et à la caméra"
      : deviceType === "microphone"
      ? "au micro"
      : "à la caméra"
  } refusé. Vérifiez les autorisations du navigateur.`,
  NotFoundError: `${
    deviceType === "all"
      ? "Micro ou caméra"
      : deviceType === "microphone"
      ? "Micro"
      : "Caméra"
  } introuvable. Branchez ou activez un périphérique.`,
  NotReadableError: `${
    deviceType === "all"
      ? "Micro ou caméra"
      : deviceType === "microphone"
      ? "Micro"
      : "Caméra"
  } inaccessible ou déjà utilisée par une autre application.`,
  OverconstrainedError: `${
    deviceType === "all"
      ? "Aucun micro/caméra"
      : deviceType === "microphone"
      ? "Aucun micro"
      : "Aucune caméra"
  } ne correspond aux paramètres spécifiés.`,
  SecurityError: `Accès ${
    deviceType === "all"
      ? "au micro/caméra"
      : deviceType === "microphone"
      ? "au micro"
      : "à la caméra"
  } bloqué pour des raisons de sécurité.`,
  TypeError: `Les paramètres ${
    deviceType === "all"
      ? "audio/vidéo"
      : deviceType === "microphone"
      ? "audio"
      : "vidéo"
  } sont invalides.`,
  AbortError: `La demande d’accès au ${
    deviceType === "all"
      ? "micro/caméra"
      : deviceType === "microphone"
      ? "micro"
      : "caméra"
  } a été annulée.`,
  UnknownError:
    "Une erreur est survenue lors de la demande d'autorisation. Vérifiez les paramètres du navigateur et réessayez",
});
export default DeviceAlertPermission;
