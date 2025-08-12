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
console.log(window.location.pathname);

const RoomInfos = () => {
  const matches = useSmallScreen();
  const { code } = useParams();
  const connected = useSelector((store) => store.user.connected);
  const setupLoading = useSelector((store) => store.conference.setup.loading);
  const Authorization = useToken();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { state } = useLocation();
  const target = useMemo(() => state?.target || null, [state]);
  const timerRef = useRef(null);
  const [{ loading, data: callDetail }] = useAxios(
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
          console.log("Received response:", e.data);
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
            <Typography color='textSecondary' align='center'>
              Vous êtes sur le point de lancer un appel
            </Typography>
            <Box>
              <Button variant='contained' color='primary'>
                {"Lancer l'appel"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default RoomInfos;
