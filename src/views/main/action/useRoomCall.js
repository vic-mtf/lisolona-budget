import { useLayoutEffect } from "react";
import { useSocket } from "../../../utils/SocketIOProvider";
import openNewWindow from "../../../utils/openNewWindow";
import { encrypt } from "../../../utils/crypt";
import { setData } from "../../../redux/meeting";
import { useDispatch, useSelector } from "react-redux";
import { useData } from "../../../utils/DataProvider";
import useAxios from "../../../utils/useAxios";
import clearTimer from "../../../utils/clearTimer";
import { DialogActions, ListItem, ListItemText, useTheme } from "@mui/material";
import useAudio from "../../../utils/useAudio";
import signal_src from "../../../assets/Samsung-Wing-SMS.webm";
import getFullName from "../../../utils/getFullName";
import { useLongTextCustomSnackbar } from "../../../components/useCustomSnackbar";
import AvatarStatus from "../../../components/AvatarStatus";
import Button from "../../../components/Button";
import setGlobalData from "../../../utils/setData";
import Typography from "../../../components/Typography";
import useTableRef from "../../../utils/useTableRef";

export default function useRoomCall() {
  const socket = useSocket();
  const { enqueueCustomSnackbar, closeCustomSnackbar } =
    useLongTextCustomSnackbar();
  const mode = useSelector((store) => store.meeting.mode);
  const [, settersCounters] = useTableRef();
  const [, settersTimers] = useTableRef();
  const [{ secretCode }] = useData();
  const token = useSelector((store) => store.user.token);
  const signalAudio = useAudio(signal_src);
  const theme = useTheme();
  const [, refetch] = useAxios(
    {
      headers: { Authorization: `Bearer ${token}` },
    },
    { manual: true }
  );
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const handleJoinMeeting = ({ timer, data: target, origin }) => {
      window.clearInterval(timer);
      const mode = "prepare";
      const wd = openNewWindow({
        url: "/meeting/",
      });

      wd.geidMeetingData = encrypt({
        target,
        mode,
        secretCode: secretCode,
        defaultCallingState: "incoming",
        origin,
      });
      if (wd) {
        dispatch(setData({ data: { mode } }));
        wd.openerSocket = socket;
      }
    };
    const handleCancelMeeting = ({ timer, target, origin }) => {
      window.clearInterval(timer);
      socket.emit("hang-up", {
        target: target.id,
        id: origin?._id,
        type: target.type,
      });
    };
    const handleCall = (event) => {
      const user = event.who;
      const id = event?.where?._id;
      const location = event?.where?.location;
      const url = "/api/chat/room/call/" + id;
      const type = event.where.type;
      const target = {
        id: user._id,
        name: getFullName(user),
        type: "direct",
        avatarSrc: user?.imageUrl,
      };

      if (type === "room") {
        refetch({ url }).then(({ data: origin }) => {
          signalAudio.audio?.play();
          const data = {
            id: origin?.room?._id,
            name: origin?.room?.name,
            type: origin?.room?.type || "room",
            avatarSrc: origin?.room?.avatarSrc,
          };
          setGlobalData({ meetings: [origin] });
          let key;
          let cursorOn = false;
          const timer = settersTimers.getObjectById(id)?.timer;
          if (timer === undefined) {
            const avatarSrc = data.avatarSrc;
            const name = data.name;
            const type = data.type;
            enqueueCustomSnackbar({
              persist: true,
              getKey: (_key) => (key = _key),
              SnackbarContentProps: {
                onMouseEnter() {
                  cursorOn = true;
                },
                onMouseLeave() {
                  cursorOn = false;
                },
              },
              message: (
                <ListItem alignItems='flex-start' dense>
                  <AvatarStatus
                    id={location}
                    avatarSrc={avatarSrc}
                    type={type}
                    name={name}
                  />
                  <ListItemText
                    primary={name}
                    primaryTypographyProps={{
                      fontWeight: "bold",
                      color: "text.primary",
                    }}
                    secondary={
                      <Typography
                        sx={{ display: "inline" }}
                        component='span'
                        variant='body2'
                        color='text.primary'>
                        Une Nouvelle réunion est actuellement en cours. vous
                        êtes cordialement invité(e) à y participer
                      </Typography>
                    }
                  />
                </ListItem>
              ),
              action: (
                <DialogActions
                  sx={{
                    p: 0,
                    m: 0,
                  }}>
                  <Button
                    variant='outlined'
                    onClick={() => {
                      handleJoinMeeting({ data, origin, timer });
                      closeCustomSnackbar();
                      clearTimer(settersTimers.getObjectById(id)?.timer);
                      settersCounters.deleteObject(id);
                      settersTimers.deleteObject(id);
                    }}>
                    Participer
                  </Button>
                  <Button
                    onClick={() => {
                      handleCancelMeeting({ target, origin, timer });
                      closeCustomSnackbar();
                      clearTimer(settersTimers.getObjectById(id)?.timer);
                      settersCounters.deleteObject(id);
                      settersTimers.deleteObject(id);
                    }}>
                    Annuler
                  </Button>
                </DialogActions>
              ),
            });
          }
          clearTimer(timer);
          settersCounters.updateObject({ counter: 0, id });
          settersTimers.updateObject({
            id,
            timer: window.setInterval(() => {
              const counter = settersCounters.getObjectById(id)?.counter;
              socket.emit("ringing", {
                id: origin?._id,
                type: target?.type,
                target: target?.id,
              });
              if (counter >= 30 && !cursorOn) {
                clearTimer(settersTimers.getObjectById(id)?.timer);
                closeCustomSnackbar(key);
                settersCounters.deleteObject(id);
                settersTimers.deleteObject(id);
              } else settersCounters.updateObject({ id, counter: counter + 1 });
            }, 1500),
          });
          const handleHangUp = () => {
            socket.off("hang-up", handleHangUp);
            clearTimer(settersTimers.getObjectById(id)?.timer);
            settersCounters.deleteObject(id);
            settersTimers.deleteObject(id);
          };
          socket.on("hang-up", handleHangUp);
        });
      }
    };
    socket?.on("call", handleCall);
    return () => {
      socket?.off("call", handleCall);
    };
  }, [
    socket,
    secretCode,
    dispatch,
    mode,
    refetch,
    signalAudio,
    theme,
    settersCounters,
    settersTimers,
    enqueueCustomSnackbar,
    closeCustomSnackbar,
  ]);
}
