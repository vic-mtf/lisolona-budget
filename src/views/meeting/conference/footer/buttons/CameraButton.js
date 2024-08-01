import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Badge, Fab, Box as MuiBox, Stack, Tooltip } from "@mui/material";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import IconButton from "../../../../../components/IconButton";
import useCameraProps from "./useCameraProps";
import { useEffect } from "react";
import store from "../../../../../redux/store";
import useSocket from "../../../../../hooks/useSocket";

export default function CameraButton() {
  const { camera, permission, handlerToggleCamera, loading } = useCameraProps();
  const socket = useSocket();

  useEffect(() => {
    const handleSignal = async (event) => {
      const meeting = store.getState().meeting;
      const camera = store.getState().meeting.camera;
      if (meeting.meetingId === event?.where?._id) {
        const users = Array.isArray(event?.who) ? event?.who : [event?.who];
        const [id] = users.map((user) =>
          typeof user === "string" ? user : user?._id
        );
        const [key] = Object.keys(event.what) || [];
        const subKeys = key ? Object.keys(event.what[key]) : [];
        if (
          meeting.me.id === id &&
          camera.active &&
          subKeys.includes("isCam")
        ) {
          handlerToggleCamera();
        }
      }
    };
    socket.on("signal", handleSignal);
    return () => {
      socket.off("signal", handleSignal);
    };
  }, [socket, handlerToggleCamera]);

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      spacing={0.1}
      direction='row'>
      <Tooltip
        title={`${camera.active ? "Desactiver" : "Activer"} la caméra`}
        arrow>
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
          invisible={camera.allowed || !permission}
          overlap='circular'
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}>
          <Fab
            size='small'
            onClick={handlerToggleCamera}
            color={camera?.active ? "primary" : "inherit"}
            disabled={permission?.state === "denied" || loading}
            sx={{
              zIndex: 0,
              borderRadius: 1,
              boxShadow: "none",
            }}>
            {camera?.active ? (
              <VideocamOutlinedIcon fontSize='small' />
            ) : (
              <VideocamOffOutlinedIcon fontSize='small' />
            )}
          </Fab>
        </Badge>
      </Tooltip>
      <IconButton disabled>
        <ExpandMoreIcon />
      </IconButton>
    </Stack>
  );
}
