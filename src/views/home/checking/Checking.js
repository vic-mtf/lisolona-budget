import React, { useEffect, useRef } from "react";
import { Backdrop, Fade, LinearProgress, Box as MuiBox } from "@mui/material";
import Typography from "../../../components/Typography";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import queryString from "query-string";
import useAxios from "../../../hooks/useAxios";
import useSnackbar from "../../../hooks/useSnackbar";
import IconButton from "../../../components/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Identify from "./Identify";
import CodeMeeting from "./CodeMeeting";

export default function Checking({ setOptions, message }) {
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const values = useMemo(
    () => queryString.parse(location.search)?.code?.split("") || [],
    [location]
  );
  const codeRef = useRef(values.join(""));
  const [{ loading, data, error }, refetch] = useAxios(
    {
      url: "api/chat/room/call/" + values.join(""),
      method: "GET",
    },
    { manual: values?.length !== 9 }
  );

  useEffect(() => {
    const status = error?.request?.status;
    const { message, severity } = messages[status] || {};

    if (severity)
      enqueueSnackbar({
        message,
        severity,
        action: (key) => (
          <IconButton onClick={() => closeSnackbar(key)}>
            <CloseOutlinedIcon />
          </IconButton>
        ),
      });
  }, [error, enqueueSnackbar, closeSnackbar]);

  return (
    <React.Fragment>
      <MuiBox
        position='relative'
        width='100%'
        display='flex'
        justifyItems='center'
        alignItems='center'
        sx={{
          "& > div": {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          },
        }}>
        <Fade unmountOnExit in={!data}>
          <MuiBox display='flex'>
            <CodeMeeting
              loading={loading}
              values={values}
              refetch={refetch}
              codeRef={codeRef}
            />
          </MuiBox>
        </Fade>
        <Fade unmountOnExit in={!!data}>
          <MuiBox display='flex' gap={1}>
            <Typography>
              Identifiez vous pour participer à la réunion
            </Typography>
            <Identify
              loading={loading}
              values={values}
              refetch={refetch}
              codeRef={codeRef}
            />
          </MuiBox>
        </Fade>
      </MuiBox>
      <Backdrop
        open={loading}
        sx={{
          background: (theme) =>
            theme.palette.background.paper + theme.customOptions.opacity,
        }}
        children={
          <React.Fragment>
            <LinearProgress
              sx={{
                width: "100%",
                position: "absolute",
                top: 0,
              }}
            />
            {message && <Typography mt={2}>{message}</Typography>}
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
}

const messages = {
  0: {
    severity: "warning",
    message: `
        Votre appareil n'est pas connecté à Internet. 
        Veuillez vérifier votre connexion réseau et réessayer.`,
  },
  404: {
    severity: "error",
    message: `
        Le code de la reunion entré est incorrect. 
        Veuillez vérifier et réessayer. `,
  },
};
