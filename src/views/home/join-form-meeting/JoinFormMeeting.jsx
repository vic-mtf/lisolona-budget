import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import {
  Backdrop,
  Box,
  Fade,
  FormLabel,
  LinearProgress,
  Toolbar,
  Tooltip,
} from "@mui/material";
import useAxios from "../../../hooks/useAxios";
import IconButton from "../../../components/IconButton";
import CodeMeeting from "./CodeMeeting";
import IdentifyForm from "./IdentifyForm";
import Typography from "../../../components/Typography";
import { useNavigate } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

export default function JoinFormMeeting({ message }) {
  const location = useLocation();
  const meetingData = useMemo(
    () => location?.state?.meeting,
    [location.state?.meeting]
  );

  const navigateTo = useNavigate();
  const values = useMemo(() => {
    let code = [];
    try {
      code = queryString.parse(location.search)?.code?.split("") || [];
    } catch (error) {
      console.error(error);
    }
    return code;
  }, [location.search]);

  const [{ loading }, refetch] = useAxios(
    {
      url: "api/chat/room/call/" + values.join(""),
      method: "GET",
    },
    { manual: true }
  );

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
        <Fade unmountOnExit in={!meetingData}>
          <Box display='flex'>
            <CodeMeeting loading={loading} values={values} refetch={refetch} />
          </Box>
        </Fade>
        <Fade unmountOnExit in={!!meetingData}>
          <Box display='flex' gap={1}>
            <Toolbar
              sx={{ width: "100%", gap: 1 }}
              disableGutters
              variant='dense'>
              <Tooltip title='Retour' arrow>
                <IconButton
                  onClick={() => navigateTo("/home", { replace: true })}>
                  <ArrowBackOutlinedIcon />
                </IconButton>
              </Tooltip>
              <FormLabel sx={{ flexGrow: 1 }}>
                Identifiez vous pour participer à la réunion
              </FormLabel>
            </Toolbar>
            <IdentifyForm loading={loading} values={values} refetch={refetch} />
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
