import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import useSmallScreen from "../../../../hooks/useSmallScreen";
import ToolbarIdentity from "./ToolbarIdentity";
import { useSelector } from "react-redux";
import useToken from "../../../../hooks/useToken";
import useAxios from "../../../../hooks/useAxios";
import { useNavigate, useParams } from "react-router-dom";
import { useLayoutEffect } from "react";

const RoomInfos = () => {
  const matches = useSmallScreen();
  const { code } = useParams();
  const setupLoading = useSelector((store) => store.conference.setup.loading);
  const navigateTo = useNavigate();
  const Authorization = useToken();
  const [{ loading, data }, refetch] = useAxios(
    {
      url: "/api/chat/room/call/" + code,

      // headers: { Authorization },
    },
    { manual: code === "create" }
  );

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
      <Slide direction='up' in={!setupLoading}>
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
      </Slide>
    </Box>
  );
};

export default RoomInfos;
