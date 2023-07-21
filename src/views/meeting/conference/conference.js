import * as React from 'react';
import Divider from '@mui/material/Divider';
import { Stack } from '@mui/material';
import styled from '@emotion/styled';
import Content from './content/Content';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import Navigation from './navigation/Navigation';
import Footer from './footer/Footer';
import EndMeeting from './actions/EndMeeting';
import { useMeetingData } from '../../../utils/MeetingProvider';

export const drawerWidth = 400;

export default function Conference() {
    const [{openEndMessageType}] = useMeetingData();
    const nav = useSelector(store => store.conference.nav);
    const open = useMemo(() => /-open/.test(nav), [nav]);

  return (
    <>
      <Stack 
          sx={{ 
              display: 'flex',
              flex: 1,
              overflow: 'hidden',
              position: 'relative',
              width: '100%',
              height: '100%',
          }}
          divider={<Divider/>}
      >
        
        <Main open={open}>
          <Content/>
        </Main>
        <Footer/>
        <Navigation open={open}/>
      </Stack>
      <EndMeeting
          open={Boolean(openEndMessageType)}
          type={openEndMessageType || undefined}
      />
    </>
  );
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      background: theme.palette.background.paper +
      theme.customOptions.opacity,
      overflow: 'hidden',
      height: '100%',
      position: 'relative',
      backdropFilter: `blur(${theme.customOptions.blur})`,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginRight: 0,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
      }),
    }),
  );