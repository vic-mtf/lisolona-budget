import Box from "../../components/Box";
import _app_logo from "../../assets/group_speak.webp";
import { Stack, Box as MuiBox, CircularProgress, Divider } from "@mui/material";
import Typography from "../../components/Typography";
import "animate.css/source/attention_seekers/swing.css";
import _platform_logo from "../../assets/geid_logo_blue_without_title.webp";
import { useCallback } from "react";
import useAxios from "../../hooks/useAxios";

import SwingAnimation from "../../components/SwingAnimation";
import store from "../../redux/store";
import useToken from "../../hooks/useToken";
import PropTypes from "prop-types";
import { updateArraysData } from "../../redux/data/data";
export default function Cover({ setLoaded }) {
  const Authorization = useToken();
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
      store.dispatch(
        updateArraysData({
          calls,
          discussions,
          contacts,
          invitations,
          callHistory,
        })
      );
    } catch (error) {
      console.error(error);
    }
    setLoaded(true);
  }, [setLoaded, refresh]);

  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
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
        <MuiBox
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
            justifyContent='center'>
            <img alt='geid-budget' src={_platform_logo} width={120} />
            <Typography noWrap variant='h4'>
              Lisolo Na Budget
            </Typography>
          </Stack>
          {loading && (
            <MuiBox
              sx={{ position: "absolute", top: "150%" }}
              display='flex'
              justifyContent='center'
              alignItems='center'
              color='text.primary'
              flexDirection='column'>
              <CircularProgress size={15} color='inherit' />
            </MuiBox>
          )}
        </MuiBox>
      </Stack>
      <Typography variant='caption' paragraph p={2}>
        Direction Archives et Nouvelles Technologie de l'Information et de la
        Communication ©2022
      </Typography>
    </Box>
  );
}

Cover.propTypes = {
  setLoaded: PropTypes.func.isRequired,
};
