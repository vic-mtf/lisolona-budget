import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../../../utils/SocketIOProvider";
import getFullName from "../../../utils/getFullName";
import Button from "../../../components/Button";
import useAxios from "../../../utils/useAxios";
import AvatarStatus from "../../../components/AvatarStatus";
import signal_src from "../../../assets/Samsung-Wing-SMS.webm";
import useAudio from "../../../utils/useAudio";
import setData from "../../../utils/setData";

export default function useScheduledMeeting() {
  const socket = useSocket();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const token = useSelector((store) => store.user.token);
  const signalAudio = useAudio(signal_src);
  const [, refetch] = useAxios(
    {
      headers: { Authorization: `Bearer ${token}` },
    },
    { manual: true },
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const onScheduledMeeting = async ({ who, where }) => {
      let data;
      const user = {
        id: who._id,
        name: getFullName(who),
        type: "direct",
        avatarSrc: who?.imageUrl,
      };
      const id = where?._id;
      const location = where?.location;
      const url = `/api/chat/room/call/${id}`;
      const type = where.type;

      if (type === "room") {
        try {
          data = await refetch({ url }).data;

          console.log(data);

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
        const date = "";

        const addEmDash = (text) => (text ? ` — ${text}` : "");

        enqueueSnackbar(
          <ListItem alignItems="flex-start" sx={{ p: 0 }} dense>
            <ListItemAvatar>
              <AvatarStatus
                id={location}
                avatarSrc={imageUrl}
                type="room"
                name={user.name}
              />
            </ListItemAvatar>
            <ListItemText
              primary={name}
              secondaryTypographyProps={{
                color: "currentcolor",
                display: "-webkit-box",
                overflow: "hidden",
                textOverflow: "ellipsis",
                sx: {
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                },
              }}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline", color: "currentcolor" }}
                    component="span"
                    variant="body2"
                  >
                    Réunion{addEmDash(title)}
                    {addEmDash(date)}
                  </Typography>
                  {addEmDash(description)}
                </React.Fragment>
              }
            />
          </ListItem>,
          {
            style: { maxWidth: 400 },
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
                Detail
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
