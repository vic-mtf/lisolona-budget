import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import useSmallScreen from "../../../../hooks/useSmallScreen";
import ToolbarIdentity from "./ToolbarIdentity";
import { useDispatch, useSelector } from "react-redux";
import useToken from "../../../../hooks/useToken";
import useAxios from "../../../../hooks/useAxios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { CALL_CHANNEL } from "../../../../utils/broadcastChannel";
import { updateConferenceData } from "../../../../redux/conference/conference";
import { useMemo } from "react";
import { useRef } from "react";
import { updateData } from "../../../../redux/data/data";
import { setStatus } from "../../../main/navigation/calls/groupCall";
import normalizeObjectKeys from "../../../../utils/normalizeObjectKeys";
import { useNotifications } from "@toolpad/core/useNotifications";

const RoomInfos = () => {
  const matches = useSmallScreen();
  const { code } = useParams();
  const connected = useSelector((store) => store.user.connected);
  const setupLoading = useSelector((store) => store.conference.setup.loading);
  const notifications = useNotifications();

  const Authorization = useToken();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { state } = useLocation();
  const target = useMemo(() => state?.target || null, [state]);
  const timerRef = useRef(null);
  const [{ loading, data: callDetail }, refetch] = useAxios(
    {
      url: "/api/chat/room/call/" + code,
      headers: { Authorization },
    },
    { manual: !code }
  );

  const data = useMemo(
    () => state?.data || callDetail,
    [callDetail, state?.data]
  );

  useEffect(() => {
    if (connected && !loading && !target && window.opener)
      CALL_CHANNEL.postMessage({ type: "request" });

    const onListeningResponse = (e) => {
      if (e.origin === window.location.origin)
        if (e.data?.type === "response") {
          //  console.log("Received response:", e.data);
          navigateTo("", {
            state: { target: e.data?.callTarget, ...state },
          });
        }
    };
    if (setupLoading && target && !loading)
      dispatch(
        updateConferenceData({
          key: "setup.loading",
          data: false,
        })
      );
    if (setupLoading && !timerRef.current && !code)
      timerRef.current = setTimeout(() => {
        dispatch(updateData({ data: { app: { loaded: false } } }));
        setTimeout(() => {
          navigateTo("/", { replace: true });
          window.close();
        }, 1000);
      }, 9000);

    if (!setupLoading && timerRef.current !== null && !code) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    CALL_CHANNEL.addEventListener("message", onListeningResponse);
    return () => {
      CALL_CHANNEL.removeEventListener("message", onListeningResponse);
    };
  }, [
    connected,
    loading,
    navigateTo,
    dispatch,
    target,
    setupLoading,
    state,
    code,
  ]);

  useEffect(() => {
    if (callDetail && !state?.data) {
      navigateTo("", {
        state: { data: callDetail, ...state },
        replace: true,
      });
    }
  }, [navigateTo, state, callDetail]);

  const isRoom = target?.type === "room";
  const status = useMemo(() => setStatus(data?.status), [data?.status]);

  const text = useMemo(
    () => ({
      type: isRoom ? "la réunion" : "l'appel",
      action: data ? (status === "ended" ? "Relancer" : "Rejoindre") : "Lancer",
    }),
    [data, isRoom, status]
  );

  const handleCreateCall = async () => {
    dispatch(
      updateConferenceData({
        key: ["loading"],
        data: [true],
      })
    );
    const request = {
      method: "POST",
      url: "/api/chat/room/call",
      data: {
        target: target?.id,
        type: isRoom ? "room" : "direct",
        tokenType: "uid",
        role: "publisher",
        start: Date.now(),
      },
    };
    try {
      const response = await refetch(request);
      const data = normalizeObjectKeys(response.data);
      const { APP_ID, APP_CERTIFICATE, TOKEN, EXPIRE_AT } =
        data?.callDetail || {};
      const participants = {};
      data?.participants?.forEach((p) => (participants[p.id] = p));

      dispatch(
        updateConferenceData({
          key: ["AGORA_DATA", "meeting.participants", "step"],
          data: [
            {
              TOKEN: TOKEN,
              APP_CERTIFICATE: APP_CERTIFICATE,
              APP_ID: APP_ID,
              EXPIRE_AT: EXPIRE_AT,
            },
            participants,
            "meeting",
          ],
        })
      );
      navigateTo("/conference/" + data.id, {
        state: { data, ...state },
        replace: true,
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        message: "Une erreur est survenue lors de la connexion.",
        severity: "error",
      });

      dispatch(updateConferenceData({ key: ["loading"], data: [false] }));
    }
  };

  return (
    <Box
      width={{ md: 400 }}
      display='flex'
      flex={1}
      flexGrow={1}
      component={Paper}
      sx={{
        position: "relative",
        borderRadius: 2,
        alignItems: "start",
        flexDirection: "column",
        overflow: "hidden",
        ...(matches && {
          bgcolor: "transparent",
        }),
      }}
      elevation={0}>
      {setupLoading && (
        <Box
          position='absolute'
          top={0}
          left={0}
          right={0}
          bottom={0}
          display='flex'
          flexDirection='column'
          justifyContent='center'
          gap={2}
          alignItems='center'>
          <div>
            <Typography variant='h6' color='inherit' my={0}>
              Préparation en cours...
            </Typography>
            <Typography variant='body2' color='inherit'>
              Veuillez patienter pendant que nous préparons la salle.
            </Typography>
          </div>

          <CircularProgress color='inherit' size={25} />
        </Box>
      )}
      <Fade
        in={!setupLoading}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}>
        <Box>
          {!matches && <ToolbarIdentity />}
          <Box
            display='flex'
            flex={1}
            width='100%'
            //flexDirection='column'
            gap={2}
            justifyContent='center'
            alignItems='center'
            flexDirection='column'
            py={{ xs: 2, md: 0 }}>
            {data?.title && (
              <Typography variant='h6' fontSize={18} align='center'>
                {data?.title}
              </Typography>
            )}
            <Typography color='textSecondary' align='center'>
              Le moment est venu de commencer
            </Typography>
            <Box>
              <Button
                variant='contained'
                color='primary'
                loading={loading}
                onClick={handleCreateCall}>
                {text.action} {text.type}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default RoomInfos;
