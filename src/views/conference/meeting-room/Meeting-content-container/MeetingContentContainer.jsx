import React from "react";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import useSmallScreen from "../../../../hooks/useSmallScreen";
import { useSelector } from "react-redux";
import BorderAnimated from "../../../../components/BorderAnimated";

const navWidth = 420;

const MeetingContentContainer = React.forwardRef((_, ref) => {
  const openNav = useSelector((store) => store.conference.meeting.nav.open);
  const matches = useSmallScreen();
  return (
    <Box
      ref={ref}
      height='100%'
      width={{
        md: openNav ? `calc(100% - ${navWidth}px)` : "100%",
        xs: "100%",
      }}
      display='flex'
      flex={1}
      flexDirection='column'
      sx={{
        transition: (t) =>
          t.transitions.create("width", {
            easing: t.transitions.easing.easeInOut,
            duration:
              t.transitions.duration[
                openNav ? "enteringScreen" : "leavingScreen"
              ],
          }),
      }}>
      <Box
        flex={1}
        component={Slide}
        direction='right'
        position='relative'
        appear={false}
        in={!matches || !openNav}>
        <Box
          left={0}
          top={0}
          right={0}
          bottom={0}
          position='absolute'
          width='100%'
          height='100%'
          display='flex'
          bgcolor='background.default'>
          <Box
            flex={1}
            bgcolor='background.default'
            zIndex={100}
            m={0.5}
            borderRadius={1}></Box>
          <BorderAnimated />
        </Box>
      </Box>
      <Slide
        in={openNav}
        direction='left'
        unmountOnExit
        appear={false}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          display: "flex",
        }}>
        <Box
          position='relative'
          display='flex'
          flex={1}
          sx={{
            borderLeft: (t) => `1px solid ${t.palette.divider}`,
            width: { md: navWidth, xs: "100%" },
          }}></Box>
      </Slide>
    </Box>
  );
});

MeetingContentContainer.displayName = "MeetingContentContainer";

export default React.memo(MeetingContentContainer);
