import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import {
  Alert,
  Badge,
  Fab,
  Box as MuiBox,
  Stack,
  Tooltip,
} from "@mui/material";
import { useEffect } from "react";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import IconButton from "../../../../../components/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import store from "../../../../../redux/store";
import useMicroProps from "./useMicroProps";
import useSocket from "../../../../../hooks/useSocket";

export default function MicroButton() {
  const { permission, micro, handleToggleMicro, loading } = useMicroProps();
  const socket = useSocket();

  useEffect(() => {
    const handleSignal = async (event) => {
      const meeting = store.getState().meeting;
      const micro = store.getState().meeting.micro;

      if (meeting.meetingId === event?.where?._id) {
        const users = Array.isArray(event?.who) ? event?.who : [event?.who];
        const [id] = users.map((user) =>
          typeof user === "string" ? user : user?._id
        );
        const [key] = Object.keys(event.what) || [];
        const subKeys = key ? Object.keys(event.what[key]) : [];
        if (meeting.me.id === id && micro.active && subKeys.includes("isMic")) {
          handleToggleMicro();
        }
      }
    };
    socket.on("signal", handleSignal);
    return () => {
      socket.off("signal", handleSignal);
    };
  }, [socket, handleToggleMicro]);

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
        title={`${micro.active ? "Desactiver" : "Activer"} le micro`}
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
          invisible={micro.allowed || !permission}
          overlap='circular'
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}>
          <Fab
            variant='circular'
            size='small'
            onClick={handleToggleMicro}
            color={micro?.active ? "primary" : "inherit"}
            disabled={permission?.state === "denied" || loading}
            sx={{
              zIndex: 0,
              borderRadius: 1,
              boxShadow: 0,
            }}>
            {micro?.active ? (
              <MicNoneOutlinedIcon fontSize='small' />
            ) : (
              <MicOffOutlinedIcon fontSize='small' />
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
