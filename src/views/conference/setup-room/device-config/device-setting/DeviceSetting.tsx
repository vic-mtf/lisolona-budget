import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  Slide,
  Fade,
} from '@mui/material';
import useSmallScreen from '@/hooks/useSmallScreen';
import React, { useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import SettingNav from './SettingNav';
import settingNavItems from './settingNavItems';

const DeviceSetting = React.forwardRef(({ onClose }, ref) => {
  const matches = useSmallScreen();
  const [tab, setTab] = useState(() => (matches ? null : 'audio'));

  return (
    <Box
      ref={ref}
      overflow="hidden"
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
    >
      <Toolbar
        sx={{
          ...(!matches && {
            position: 'absolute',
            zIndex: (t) => t.zIndex.appBar,
          }),
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={!tab || !matches ? onClose : () => setTab(null)}
          aria-label="close"
          key={tab}
        >
          {!tab || !matches ? <CloseOutlinedIcon /> : <ArrowBackOutlinedIcon />}
        </IconButton>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          Paramètres
        </Typography>
      </Toolbar>
      <Box
        overflow="hidden"
        position="relative"
        display="flex"
        flex={1}
        minHeight={{ md: 600 }}
        width={{ md: 800, xs: '100%' }}
      >
        <Slide
          in={matches ? !tab : true}
          unmountOnExit
          appear={false}
          direction="right"
          style={{
            ...(!matches && { flex: 0.6 }),
          }}
        >
          <Box display="flex" flex={1} overflow="hidden" flexDirection="column">
            {!matches && <Toolbar />}
            <SettingNav tab={tab} setTab={setTab} />
          </Box>
        </Slide>
        {!matches && <Divider flexItem orientation="vertical" />}
        <Slide
          in={matches ? Boolean(tab) : true}
          unmountOnExit
          appear={false}
          direction="left"
          style={{
            flex: 1,
            ...(matches && {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
            }),
          }}
        >
          <Box
            display="flex"
            flex={1}
            overflow="hidden"
            flexDirection="column"
            position="relative"
          >
            {!matches && <Toolbar />}
            {settingNavItems.map(({ component: Component = 'div', value }) => (
              <Fade
                key={value}
                in={tab === value}
                unmountOnExit
                appear={false}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                  display: 'flex',
                  flex: 1,
                  overflow: 'hidden',
                  flexDirection: 'column',
                }}
              >
                <Box
                  flex={1}
                  overflow="hidden"
                  display="flex"
                  flexDirection="column"
                >
                  <Component />
                </Box>
              </Fade>
            ))}
          </Box>
        </Slide>
      </Box>
    </Box>
  );
});
DeviceSetting.displayName = 'DeviceSetting';

export default DeviceSetting;
