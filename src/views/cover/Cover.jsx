import React from 'react';
import _app_logo from '../../assets/group_speak.webp';
import {
  Stack,
  Box,
  CircularProgress,
  Divider,
  Typography,
  Fade,
} from '@mui/material';
import _platform_logo from '../../assets/geid_logo_blue_without_title.webp';
import { useCallback } from 'react';
import useAxios from '../../hooks/useAxios';
import SwingAnimation from '../../components/SwingAnimation';
import store from '../../redux/store';
import useToken from '../../hooks/useToken';
import { updateArraysData, updateData } from '../../redux/data/data';
import { useDispatch, useSelector } from 'react-redux';

const Cover = React.forwardRef((_, ref) => {
  const Authorization = useToken();
  const name = useSelector((store) => store.user.firstName);
  const dispatch = useDispatch();
  const [{ loading, data }, refresh] = useAxios(
    {
      url: '/api/chat',
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
      const { data: calls } = await refresh({ url: '/api/chat/room/call/' });

      const data = {
        calls,
        discussions,
        contacts,
        notifications: [
          ...invitations.map((d) => ({ ...d, variant: 'guest' })),
        ],
        callHistory,
      };
      const user = store.getState().user;
      //dispatch(updateArraysData({ data, user }));
      setTimeout(() => {
        dispatch(updateArraysData({ data, user }));
      }, 1000);
    } catch (error) {
      console.error(error);
    }
    setTimeout(() => {
      dispatch(updateData({ data: { app: { loaded: true } } }));
    }, 2500);
  }, [refresh, dispatch]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      position="fixed"
      ref={ref}
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
    >
      <Stack
        display="flex"
        justifyContent="center"
        alignItems="center"
        flex={1}
        spacing={1}
      >
        <SwingAnimation delay={2} onFinish={handleDataApp}>
          <img
            src={_app_logo}
            draggable={false}
            alt="lisolo na budget"
            style={{
              height: 100,
              width: 100,
              aspectRatio: 1,
            }}
          />
        </SwingAnimation>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          position="relative"
        >
          <Stack
            spacing={1}
            direction="row"
            width={500}
            my={1}
            divider={
              <Divider
                flexItem
                orientation="vertical"
                sx={{
                  bgcolor: 'text.primary',
                  borderWidth: 1,
                }}
              />
            }
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              '& > img': {
                height: {
                  xs: 35,
                  md: 40,
                },
              },
              '& > div': {
                fontSize: {
                  xs: 25,
                  md: 30,
                },
              },
            }}
          >
            <img alt="geid-budget" src={_platform_logo} />
            <Typography noWrap variant="h4">
              Lisolo Na Budget
            </Typography>
          </Stack>
          <Box
            position="relative"
            py={2}
            justifyContent="center"
            alignItems="center"
            display="flex"
          >
            <Fade
              unmountOnExit
              in={loading}
              appear={false}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <CircularProgress
                size={15}
                color="inherit"
                sx={{ color: 'text.primary' }}
              />
            </Fade>
            <Fade in={!!data && !loading} appear={false}>
              <Typography
                color="text.secondary"
                noWrap
                textOverflow="clip"
                variant="caption"
              >
                Bienvenue {name}, démarrage de votre espace en cours ...
              </Typography>
            </Fade>
          </Box>
        </Box>
      </Stack>
      <Typography variant="caption" p={2} fontSize={12} textAlign="center">
        {
          "Direction Archives et Nouvelles Technologie de l'Information et de la Communication ©2022"
        }
      </Typography>
    </Box>
  );
});

Cover.displayName = 'Cover';
export default Cover;
