import { useCallback, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMeetingData } from "../../../../../utils/MeetingProvider";
import { useData } from "../../../../../utils/DataProvider";
import { setCameraData } from "../../../../../redux/meeting";
import store from "../../../../../redux/store";
import AgoraRTC from "agora-rtc-react";
import { toggleStreamActivation } from "../../../../home/checking/FooterButtons";
import getPermission from "../../../../../utils/getPermission";
import useCustomSnackbar from "../../../../../components/useCustomSnackbar";
import IconButton from "../../../../../components/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function useCameraProps() {
  const camera = useSelector((store) => store.meeting.camera);
  const { enqueueCustomSnackbar, closeCustomSnackbar } = useCustomSnackbar();
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState(null);
  const [{ videoStreamRef, client }] = useData();
  const [{ localTrackRef }] = useMeetingData();
  const dispatch = useDispatch();

  const handleDispatchAllowed = useCallback(
    (allowed) => {
      dispatch(setCameraData({ data: { allowed } }));
    },
    [dispatch]
  );

  const getVideoStream = useCallback(() => {
    setLoading(true);
    const videoDevice = store.getState().meeting.video.input;
    navigator?.mediaDevices
      ?.getUserMedia({
        video: videoDevice.deviceId
          ? videoDevice
          : {
              width: { ideal: window.innerWidth },
              height: { ideal: window.innerHeight },
            },
      })
      .then(async (stream) => {
        videoStreamRef.current = stream;
        const screenPublished =
          store.getState().meeting.screenSharing.published;
        if (!screenPublished) {
          const [mediaStreamTrack] = stream.getVideoTracks();
          localTrackRef.current.videoTrack = AgoraRTC.createCustomVideoTrack({
            mediaStreamTrack,
          });
          await client.publish([localTrackRef.current.videoTrack]);
        }
        dispatch(setCameraData({ data: { active: true, published: true } }));
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        const message = e.toString().toLowerCase();
        if ("notreadableerror: could not start video source" === message) {
          let key;
          enqueueCustomSnackbar({
            message: `Caméra occupée par une autre application.`,
            severity: "error",
            getKey: (_key) => (key = _key),
            action: (
              <IconButton
                onClick={() => {
                  closeCustomSnackbar(key);
                }}>
                <CloseOutlinedIcon />
              </IconButton>
            ),
          });
        }
      });
  }, [
    dispatch,
    videoStreamRef,
    localTrackRef,
    client,
    closeCustomSnackbar,
    enqueueCustomSnackbar,
  ]);

  const handlerToggleCamera = useCallback(async () => {
    if (permission?.state !== "denied") {
      const stream = videoStreamRef.current;
      if (stream) {
        setLoading(true);
        toggleStreamActivation(stream, "video");
        const state = !camera.active;
        const screenPublished =
          store.getState().meeting.screenSharing.published;
        if (!screenPublished) {
          if (camera.published && camera.active)
            await client.unpublish([localTrackRef.current.videoTrack]);
          if (!camera.published && !camera.active) {
            const [mediaStreamTrack] = stream.getVideoTracks();
            localTrackRef.current.videoTrack = AgoraRTC.createCustomVideoTrack({
              mediaStreamTrack,
            });
            await client.publish([localTrackRef.current.videoTrack]);
          }
        }
        dispatch(setCameraData({ data: { active: state, published: state } }));
        setLoading(false);
      } else getVideoStream();
    } else {
      //message video ici
    }
  }, [
    videoStreamRef,
    camera,
    permission,
    dispatch,
    getVideoStream,
    client,
    localTrackRef,
  ]);

  useLayoutEffect(() => {
    if (!permission)
      getPermission("camera").then((permission) => {
        setPermission(permission);
        handleDispatchAllowed(permission.state === "granted");
      });
    const handleChangeState = (event) => {
      const permission = event.target;
      setPermission(permission);
      handleDispatchAllowed(permission.state === "granted");
    };
    permission?.addEventListener("change", handleChangeState);
    return () => {
      permission?.removeEventListener("change", handleChangeState);
    };
  }, [permission, handleDispatchAllowed]);

  return {
    handlerToggleCamera,
    loading,
    camera,
    permission,
    handleDispatchAllowed,
  };
}
