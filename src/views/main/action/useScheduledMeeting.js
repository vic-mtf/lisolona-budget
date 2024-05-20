import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useSocket } from "../../../utils/SocketIOProvider";
import Button from "../../../components/Button";
import useAxios from "../../../utils/useAxios";
import AvatarStatus from "../../../components/AvatarStatus";
import signal_src from "../../../assets/Samsung-Wing-SMS.webm";
import useAudio from "../../../utils/useAudio";
import setData from "../../../utils/setData";
import formatDates from "../../../utils/formatDates";

export default function useScheduledMeeting() {
  const socket = useSocket();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const token = useSelector((store) => store.user.token);
  const signalAudio = useAudio(signal_src);
  const [, refetch] = useAxios(
    { headers: { Authorization: `Bearer ${token}` } },
    { manual: true },
  );

  useEffect(() => {
    const onScheduledMeeting = async ({ who, where }) => {
      let data;
      const id = where?._id;
      const location = where?.location;
      const url = `/api/chat/room/call/${id}`;
      const type = where.type;

      if (type === "room") {
        try {
          const response = await refetch({ url });
          data = response?.data;
          setData({ meetings: [data] });
          signalAudio.audio?.play();
        } catch (e) {}
      }
      if (data) {
        console.log(data);
        const name = data?.room?.name;
        const title = data?.title;
        const imageUrl = data?.room?.imageUrl;
        const description = data?.description;
        const startedAt = data?.startedAt;
        const endedAt = data?.endedAt;
        const date = formatDates(startedAt, endedAt);
        const addEmDash = (text) => (text ? ` — ${text}` : "");

        enqueueSnackbar(
          <ListItem alignItems="flex-start" sx={{ p: 0 }} dense>
            <ListItemAvatar>
              <AvatarStatus
                mode={(mode) => (mode === "dark" ? "light" : mode)}
                id={location}
                avatarSrc={imageUrl}
                type="room"
                invisible
                name={name}
              />
            </ListItemAvatar>
            <ListItemText
              primary={name}
              primaryTypographyProps={{ fontWeight: "bold" }}
              secondaryTypographyProps={{
                color: "currentcolor",
                display: "-webkit-box",
                overflow: "hidden",
                textOverflow: "ellipsis",
                sx: {
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                },
              }}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline", color: "currentcolor" }}
                    component="span"
                    variant="body2"
                  >
                    {title}
                    {addEmDash(date)}
                  </Typography>
                  {addEmDash(description)}
                </React.Fragment>
              }
            />
          </ListItem>,
          {
            style: { maxWidth: 500 },
            action: ({ id }) => (
              <Button
                onClick={() => {
                  closeSnackbar(id);
                  const name = "_meeting-detail";
                  const root = document.getElementById("root");
                  const customEvent = new CustomEvent(name, {
                    detail: { data, name },
                  });
                  root.dispatchEvent(customEvent);
                }}
                color="inherit"
              >
                Fermer
              </Button>
            ),
          },
        );
      }
    };

    socket.on("scheduled", onScheduledMeeting);
    return () => {
      socket.off("scheduled", onScheduledMeeting);
    };
  }, [socket, enqueueSnackbar, closeSnackbar, refetch, signalAudio]);
}
