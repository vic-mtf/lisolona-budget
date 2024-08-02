import * as React from "react";
import NavDrawer, { DrawerHeader } from "../../../components/NavDrawer";
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

export default function Navigation() {
  const toolbarTheme = useTheme("light");
  const contentToolbarTheme = useTheme("dark");
  const muiTheme = useMuiTheme();
  const matches = useMediaQuery(muiTheme.breakpoints.up("sm"));

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
          ...(!matches && {
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
          <ThemeProvider theme={contentToolbarTheme}></ThemeProvider>
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
          <Box width={60}>a</Box>
          <Box>b</Box>
        </Stack>
      </NavDrawer>
    </>
  );
}
