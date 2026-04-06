import React from "react";
import useSmallScreen from "@/hooks/useSmallScreen";
import NavDrawer from "@/components/NavDrawer";
import { useState } from "react";
import { Box, Fade } from "@mui/material";
import navigation from "./navigation";
import { createElement } from "react";
import { useSelector } from "react-redux";

const MessagingBoxDetails = React.memo(() => {
  const matches = useSmallScreen();
  const [nav, setNav] = useState(navigation[0].id);
  const open = useSelector(
    (store) => store.data.app.actions.messaging.info.open
  );
  return (
    <>
      <NavDrawer
        anchor='right'
        variant='persistent'
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            border: "none",

            borderLeft: (theme) =>
              matches ? "none" : `1px solid ${theme.palette.divider}`,
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
          ...(matches && {
            width: "100%",
            "& .MuiDrawer-paper": {
              width: "100%",
              transition: (theme) =>
                theme.transitions.create("width", {
                  easing: theme.transitions.easing.easeIn,
                  duration: theme.transitions.duration.enteringScreen,
                }),
            },
          }),
        }}>
        <Box display='flex' flex={1} overflow='hidden' position='relative'>
          {navigation.map(({ component = "div", id }) => (
            <Fade
              appear={false}
              in={id === nav}
              key={id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                display: "flex",
                height: "100%",
                width: "100%",
              }}>
              <Box>{createElement(component, { setNav })}</Box>
            </Fade>
          ))}
        </Box>
      </NavDrawer>
    </>
  );
});
MessagingBoxDetails.displayName = "MessagingBoxDetails";
export default MessagingBoxDetails;
