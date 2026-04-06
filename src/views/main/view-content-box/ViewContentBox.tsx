import { alpha, Box, Fade, Slide } from '@mui/material';
import { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Presentation from './presentation/Presentation';
import MessagingBox from './messaging-box/MessagingBox';
import useSmallScreen from '@/hooks/useSmallScreen';
import MessagingBoxDetails from './messaging-box/messaging-box-details/MessagingBoxDetails';
import { drawerWidth } from '@/components/MainContent';
import MessagingProvider from './messaging-box/MessagingBoxProvider';

export default function Views() {
  const targetView = useSelector((store) => store.data.targetView);
  const matches = useSmallScreen();
  const AnimateFrame = useMemo(() => (matches ? Slide : Fade), [matches]);
  const openRightNav = useSelector(
    (store) => store.data.app.actions.messaging.info.open
  );

  const animateFrameProps = useMemo(() => ({ direction: 'left' }), []);

  const openMain = useMemo(
    () => (openRightNav && matches ? false : Boolean(targetView || !matches)),
    [targetView, matches, openRightNav]
  );

  if (openRightNav && animateFrameProps.direction === 'left')
    animateFrameProps.direction = 'right';

  useEffect(() => {
    if (!openRightNav && animateFrameProps.direction === 'right')
      animateFrameProps.direction = 'left';
  }, [animateFrameProps, openRightNav]);

  return (
    <>
      <Fade in={openMain} style={{ opacity: 1, zIndex: 0 }} appear={false}>
        <Box
          component="main"
          width="100%"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer,
            display: { xs: 'flex', md: 'flex' },
            position: { xs: 'fixed', md: 'relative' },
            overflow: 'hidden',
            marginRight: openRightNav ? 0 : -drawerWidth + 'px',
            transition: (theme) =>
              theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            top: 0,
            height: '100%',
            '& > div': {
              display: 'flex',
              overflow: 'hidden',
              position: 'absolute',
              height: '100%',
              width: '100%',
              top: 0,
              left: 0,
            },
            '& > div:first-of-type > div': {
              overflow: 'hidden',
              position: 'relative',
            },
          }}
        >
          <AnimateFrame
            appear={false}
            in={!targetView && !matches}
            unmountOnExit
          >
            <Box justifyContent="center" alignItems="center">
              <Presentation />
            </Box>
          </AnimateFrame>

          <AnimateFrame
            appear={false}
            in={matches && openRightNav ? false : targetView === 'messages'}
            unmountOnExit
            {...(matches && animateFrameProps)}
          >
            <Box
              flexDirection="column"
              bgcolor="background.default"
              sx={{
                backgroundImage: (theme) => {
                  const color = alpha(theme.palette.background.paper, 0.8);
                  return `linear-gradient(${color},${color})`;
                },
              }}
            >
              <MessagingBox />
            </Box>
          </AnimateFrame>
        </Box>
      </Fade>
      <MessagingProvider>
        <MessagingBoxDetails />
      </MessagingProvider>
    </>
  );
}
