import StopScreenShareOutlinedIcon from "@mui/icons-material/StopScreenShareOutlined";
import ScreenShareOutlinedIcon from "@mui/icons-material/ScreenShareOutlined";
import { Badge, Fab, Tooltip } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import { setScreenSharingData } from "../../../../../redux/meeting";
import { useData } from "../../../../../utils/DataProvider";
import { useMeetingData } from "../../../../../utils/MeetingProvider";
import store from "../../../../../redux/store";
import AgoraRTC from "agora-rtc-react";
import closeMediaStream from "../../../../../utils/closeMediaStream";
import useClientState from "../../actions/useClientState";
import { useSocket } from "../../../../../utils/SocketIOProvider";

export default function ScreenSharingButton() {
  const screen = useSelector((store) => store.meeting.screenSharing);
  const socket = useSocket();
  const id = useSelector((store) => store.meeting.me.id);
  const auth = useClientState({ id, props: ["shareScreen"], key: "auth" });
  const [{ videoStreamRef, screenStreamRef, client }] = useData();
  const [{ localTrackRef }] = useMeetingData();
  const [loading, setLoading] = useState();
  const dispatch = useDispatch();

  const handleToggleScreenSharing = async (event) => {
    const { videoTrack, audioTrack } = localTrackRef.current;
    const cameraPublished = store.getState().meeting.camera.published;
    const optionsDisplay = store.getState().meeting.screen.output;
    setLoading(true);
    if (screen.active) {
      if (cameraPublished) {
        const stream = videoStreamRef.current;
        const [mediaStreamTrack] = stream.getVideoTracks();
        const videoTrack = localTrackRef.current.videoTrack;
        await videoTrack.replaceTrack(mediaStreamTrack);
      } else {
        const videoTrack = localTrackRef.current.videoTrack;
        await client.unpublish([videoTrack]);
      }
      await closeMediaStream(screenStreamRef.current);
      dispatch(
        setScreenSharingData({
          data: {
            active: false,
            published: false,
          },
        })
      );
      socket.emit("signal", {
        id: store.getState().meeting.meetingId,
        type: "state",
        obj: { autoPinScreen: false },
        who: [store.getState().meeting?.me?.id],
      });
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(
          optionsDisplay
        );
        screenStreamRef.current = stream;
        const [mediaStreamTrack] = stream.getVideoTracks();
        const localVideoScreenTrack = AgoraRTC.createCustomVideoTrack({
          mediaStreamTrack,
        });
        if (cameraPublished && videoTrack)
          await videoTrack.replaceTrack(mediaStreamTrack);
        else {
          localTrackRef.current.videoTrack = localVideoScreenTrack;
          await client.publish([localVideoScreenTrack]);
        }
        dispatch(
          setScreenSharingData({
            data: {
              active: true,
              published: true,
            },
          })
        );
        socket.emit("signal", {
          id: store.getState().meeting.meetingId,
          type: "state",
          obj: { autoPinScreen: true },
          who: [store.getState().meeting?.me?.id],
        });
      } catch (e) {
        console.error("screen error: ", e);
      }
    }

    setLoading(false);
  };

  return (
    <Tooltip title={message(auth?.shareScreen, screen.active)} arrow>
      <Badge
        badgeContent={
          <PriorityHighRoundedIcon
            fontSize='small'
            sx={{
              bgcolor: "error.main",
              color: "white",
              borderRadius: 25,
            }}
          />
        }
        invisible
        overlap='circular'
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}>
        <Fab
          size='small'
          onClick={handleToggleScreenSharing}
          color={screen?.active ? "primary" : "inherit"}
          disabled={loading || !auth?.shareScreen}
          sx={{
            zIndex: 0,
            borderRadius: 1,
            boxShadow: "none",
          }}>
          {screen?.active ? (
            <StopScreenShareOutlinedIcon fontSize='small' />
          ) : (
            <ScreenShareOutlinedIcon fontSize='small' />
          )}
        </Fab>
      </Badge>
    </Tooltip>
  );
}

const message = (allowed, active) =>
  allowed
    ? `${active ? "Arreter le partage" : "Partage"} d'écran`
    : `Le modérateur ou le responsable de cette réunion n'a pas autorisé le partage d'écran.`;
