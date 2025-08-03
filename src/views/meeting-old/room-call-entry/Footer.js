import { Backdrop, LinearProgress, Box as MuiBox } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMeetingData } from "../../../utils/MeetingProvider";
import { useCallback, useState } from "react";
import useCreateMeeting from "../actions/useCreateMeeting";
import useJoinMeeting from "../actions/useJoinMeeting";
import store from "../../../redux/store";
import { setData } from "../../../redux/meeting";
import Typography from "../../../components/Typography";
import useSocket from "../../../hooks/useSocket";

export default function Footer() {
  const [{ meetingData }] = useMeetingData();
  const [loading, setLoading] = useState(false);
  const handleCreateMeeting = useCreateMeeting();
  const handleJoinMeeting = useJoinMeeting();
  const socket = useSocket();
  const handleStartMeeting = useCallback(async () => {
    const state = meetingData.defaultCallingState;
    const origin = meetingData.origin;
    const userId = store.getState().user.id;
    setLoading(true);
    try {
      if (state === "before") {
        const data = await handleCreateMeeting();
        const callData = {
          id: data?._id,
          type: data?.room?.type || "direct",
          who: data.participants
            ?.filter(({ identity }) => identity?._id !== userId)
            ?.map(({ identity }) => identity?._id),
        };
        socket.emit("call", callData);
      } else await handleJoinMeeting(origin?._id);
      store.dispatch(
        setData({
          data: { mode: "on" },
        })
      );
    } catch (e) {}
    setLoading(false);
  }, [handleCreateMeeting, handleJoinMeeting, meetingData, socket]);

  return (
    <>
      <MuiBox>
        <LoadingButton
          variant='contained'
          color='primary'
          loading={loading}
          onClick={handleStartMeeting}
          sx={{
            textTransform: "none",
          }}>
          {meetingData?.defaultCallingState === "before"
            ? "Commencer la réunion"
            : "Participer à la réunion"}
        </LoadingButton>
      </MuiBox>
      <Backdrop
        sx={{
          background: (theme) =>
            theme.palette.background.paper + theme.customOptions.opacity,
          zIndex: (theme) => theme.zIndex.drawer + 100,
        }}
        open={loading}>
        <LinearProgress
          sx={{
            position: "absolute",
            width: "100%",
            top: -5,
          }}
        />
        <Typography
          variant='h6'
          position='absolute'
          width='100%'
          height='100%'
          display='flex'
          color='text.primary'
          justifyContent='center'
          align='center'
          alignItems='center'>
          Veuillez patienter...
        </Typography>
      </Backdrop>
    </>
  );
}
