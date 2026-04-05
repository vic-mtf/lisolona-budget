import { CssBaseline, Box } from "@mui/material";
import Navigation from "./navigation/Navigation";
import Views from "./view-content-box/ViewContentBox";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import TestSocket from "../../test/TestSocket";

export default function Main() {
  return (
    <>
      <Box
        display='flex'
        flex={1}
        width='100%'
        flexDirection='column'
        position='relative'
        overflow='hidden'>
        <Box sx={{ display: "flex", flex: 1, width: "100%" }}>
          <CssBaseline />
          <Navigation />
          <Views />
        </Box>
      </Box>
      <ReloadData />
      <TestSocket />
    </>
  );
}

const ReloadData = () => {
  const connected = useSelector((store) => store.user.connected);
  const loaded = useSelector((store) => store.data.app.loaded);

  useEffect(() => {
    if (connected && !loaded) window.location.reload();
  }, [connected, loaded]);

  return null;
};
