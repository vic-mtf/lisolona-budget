import { Stack, Box } from "@mui/material";
import NavTab from "./NavTab";
import NavigationContent from "./NavigationContent";
import NavDrawer from "@/components/NavDrawer";
import { useSelector } from "react-redux";
import useSmallScreen from "@/hooks/useSmallScreen";
import OutsideVoiceViewer from "./OutsideVoiceViewer";

export default function Navigation() {
  const matches = useSmallScreen();

  const targetView = useSelector((store) => store.data.targetView);

  return (
    <>
      <NavDrawer
        anchor='left'
        variant={matches ? "persistent" : "permanent"}
        open={!targetView}
        sx={{
          "& .MuiDrawer-paper": {
            border: "none",
            borderRight: (theme) =>
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
        <Stack
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
            <OutsideVoiceViewer />
          </Box>
        </Stack>
      </NavDrawer>
    </>
  );
}
