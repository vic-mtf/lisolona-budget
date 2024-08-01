import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import useSnackbar from "../../../hooks/useSnackbar";
import queryString from "query-string";
import { Backdrop, Box, Fade, LinearProgress, Typography } from "@mui/material";
import messages from "./messages";
import useAxios from "../../../hooks/useAxios";
import IconButton from "../../../components/IconButton";
import CodeMeeting from "./CodeMeeting";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function JoinFormMeeting({ message }) {
  const location = useLocation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const values = useMemo(() => {
    let code = [];
    try {
      code = queryString.parse(location.search)?.code?.split("") || [];
    } catch (error) {
      console.error(error);
    }
    return code;
  }, [location.search]);

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
    <>
      <Box
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
          <Box display='flex'>
            <CodeMeeting loading={loading} values={values} refetch={refetch} />
          </Box>
        </Fade>
        <Fade unmountOnExit in={!!data}>
          <Box display='flex' gap={1}>
            <Typography>
              Identifiez vous pour participer à la réunion
            </Typography>
            <Identify loading={loading} values={values} refetch={refetch} />
          </Box>
        </Fade>
      </Box>
      <Backdrop
        open={loading}
        sx={{
          background: (theme) =>
            theme.palette.background.paper + theme.customOptions.opacity,
        }}
        children={
          <>
            <LinearProgress
              sx={{
                width: "100%",
                position: "absolute",
                top: 0,
              }}
            />
            {message && <Typography mt={2}>{message}</Typography>}
          </>
        }
      />
    </>
  );
}
