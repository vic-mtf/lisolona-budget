import * as React from "react";
import NavDrawer from "../../../components/NavDrawer";
import {
  Divider,
  Stack,
  Box,
  Toolbar,
  ThemeProvider,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import useTheme from "../../../hooks/useTheme";
import LogoTitle from "./LogoTitle";
import NavTab from "./NavTab";
import NavigationContent from "./NavigationContent";

export default function Navigation() {
  const toolbarTheme = useTheme("light");
  const contentToolbarTheme = useTheme("dark");
  const muiTheme = useMuiTheme();
  const matches = useMediaQuery(muiTheme.breakpoints.down("md"));

  return (
    <>
      <NavDrawer
        anchor='left'
        open
        sx={{
          "& .MuiDrawer-paper": {
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
        <Toolbar
          sx={{ bgcolor: toolbarTheme.palette.primary.main }}
          variant='dense'>
          <ThemeProvider theme={contentToolbarTheme}>
            <LogoTitle />
          </ThemeProvider>
        </Toolbar>
        <Stack
          divider={<Divider orientation='vertical' />}
          direction='row'
          display='flex'
          flex={1}
          overflow='hidden'
          sx={{
            "&  > div": {
              display: "flex",
              height: "100%",
            },
          }}>
          <Box width={40}></Box>
          <Box
            display='flex'
            overflow='hidden'
            flex={1}
            sx={{ flexDirection: { xs: "column-reverse", md: "column" } }}>
            <Box>
              <NavTab />
            </Box>
            <Box
              display='flex'
              flex={1}
              overflow='hidden'
              position='relative'
              sx={{
                "& > div": {
                  display: "flex",
                  overflow: "hidden",
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  top: 0,
                  left: 0,
                },
              }}>
              <NavigationContent />
            </Box>
          </Box>
        </Stack>
      </NavDrawer>
    </>
  );
}
