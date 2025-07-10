import _app_logo from "../../assets/group_speak.webp";
import {
  Stack,
  Box,
  CircularProgress,
  Divider,
  Typography,
  Fade,
} from "@mui/material";
import _platform_logo from "../../assets/geid_logo_blue_without_title.webp";
import { useCallback } from "react";
import useAxios from "../../hooks/useAxios";
import SwingAnimation from "../../components/SwingAnimation";
import store from "../../redux/store";
import useToken from "../../hooks/useToken";
import { updateArraysData, updateData } from "../../redux/data/data";
import { useDispatch } from "react-redux";

export default function Cover() {
  const Authorization = useToken();
  const dispatch = useDispatch();
  const [{ loading }, refresh] = useAxios(
    {
      url: "/api/chat",
      headers: { Authorization },
    },
    { manual: true }
  );

  const handleDataApp = useCallback(async () => {
    try {
      const response = await refresh();

      const {
        chats: discussions,
        contacts,
        invitations,
        callHistory,
      } = response.data || {};
      const { data: calls } = await refresh({ url: "/api/chat/room/call/" });
      const data = {
        calls,
        discussions,
        contacts,
        notifications: [
          ...invitations.map((d) => ({ ...d, variant: "guest" })),
        ],
        callHistory,
      };
      const user = store.getState().user;
      dispatch(updateArraysData({ data, user }));
    } catch (error) {
      console.error(error);
    }
    dispatch(updateData({ data: { app: { loaded: true } } }));
  }, [refresh, dispatch]);

  return (
    <Box
      height='100%'
      width='100%'
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection='column'
      position='absolute'
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow='hidden'>
      <Stack
        display='flex'
        justifyContent='center'
        alignItems='center'
        flex={1}
        spacing={1}>
        <SwingAnimation delay={2} onFinish={handleDataApp}>
          <img
            src={_app_logo}
            draggable={false}
            alt='lisolo na budget'
            style={{
              height: 100,
              width: 100,
              aspectRatio: 1,
            }}
          />
        </SwingAnimation>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          flexDirection='column'
          position='relative'>
          <Stack
            spacing={1}
            direction='row'
            width={500}
            my={1}
            divider={
              <Divider
                flexItem
                orientation='vertical'
                sx={{
                  bgcolor: "text.primary",
                  borderWidth: 1,
                }}
              />
            }
            display='flex'
            justifyContent='center'
            alignItems='center'
            sx={{
              "& > img": {
                height: {
                  xs: 35,
                  md: 40,
                },
              },
              "& > div": {
                fontSize: {
                  xs: 25,
                  md: 30,
                },
              },
            }}>
            <img alt='geid-budget' src={_platform_logo} />
            <Typography noWrap variant='h4'>
              Lisolo Na Budget
            </Typography>
          </Stack>
          <Fade unmountOnExit in={loading} appear={false}>
            <Box
              sx={{ position: "absolute", top: "150%" }}
              display='flex'
              justifyContent='center'
              alignItems='center'
              color='text.primary'
              flexDirection='column'>
              <CircularProgress size={15} color='inherit' />
            </Box>
          </Fade>
        </Box>
      </Stack>
      <Typography variant='caption' p={2} fontSize={12} textAlign='center'>
        {
          "Direction Archives et Nouvelles Technologie de l'Information et de la Communication ©2022"
        }
      </Typography>
    </Box>
  );
}
