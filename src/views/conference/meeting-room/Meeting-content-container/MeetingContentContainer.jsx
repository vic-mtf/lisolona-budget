import React from "react";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import useSmallScreen from "../../../../hooks/useSmallScreen";
import { useSelector } from "react-redux";
import RaiseHandSignal from "../footer/main-actions/RaiseHandSignal";
import LiveInteractionGridView from "./live-interaction-grid-view/LiveInteractionGridView";
import PresentationView from "./presentation-view/PresentationView";
import DragDropContainer from "../../../../components/DragDropContainer";
import Nav from "../nav/Nav";
import LocalParticipantView from "./local-participant-view/LocalParticipantView";
import LocalViewWrapper from "./local-participant-view/LocalViewWrapper";
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
            position='relative'
            bgcolor='background.default'
            zIndex={100}
            overflow='hidden'
            m={0.5}
            borderRadius={1}>
            <ViewContainer />
          </Box>
          <RaiseHandSignal />
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
          }}>
          <Nav />
        </Box>
      </Slide>
    </Box>
  );
});

const ViewContainer = () => {
  const view = useSelector((store) => store.conference.meeting.view.layoutView);
  const isFloating = useSelector(
    (store) =>
      store.conference.meeting.view.localParticipant.mode === "floating"
  );
  return (
    <Box
      position='absolute'
      top={0}
      left={0}
      right={0}
      bottom={0}
      width={"100%"}
      height={"100%"}
      sx={{
        "& > liveInteractionGrid, & > presentation": {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
        },
      }}>
      {isFloating && <LocalViewWrapper />}
      <Slide
        in={view === "liveInteractionGrid"}
        className='liveInteractionGrid'
        direction='right'
        unmountOnExit
        appear={false}>
        <LiveInteractionGridView />
      </Slide>
      <Slide
        in={view === "presentation"}
        className='presentation'
        direction='left'
        unmountOnExit
        appear={false}>
        <PresentationView />
      </Slide>
    </Box>
  );
};

MeetingContentContainer.displayName = "MeetingContentContainer";

export default React.memo(MeetingContentContainer);
