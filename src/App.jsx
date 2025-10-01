import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import BoxGradient from "./components/BoxGradient";
import router from "./router/router";
import { decrypt } from "./utils/crypt";
import { updateUser } from "./redux/user";
import scrollBarSx from "./utils/scrollBarSx";
import { Box, Fade } from "@mui/material";
import Cover from "./views/cover/Cover";
import { SIGN_IN_CHANNEL } from "./utils/broadcastChannel";
import ErrorNetwork from "./components/ErrorNetwork";

function App() {
  const connected = useSelector((store) => store.user.connected);
  const loaded = useSelector((store) => store.data.app.loaded);
  const dispatch = useDispatch();
  const isConference = useMemo(() => {
    const isValidConference = /\/conference\/\w+/.test(
      window.location.pathname
    );
    return isValidConference;
  }, []);

  useEffect(() => {
    if (!connected) {
      const handleAutoConnection = (event) => {
        const { data: encryptData } = event;
        const decryptData = decrypt(encryptData);
        if (decryptData) {
          const data = { ...decryptData, connected: true };
          dispatch(updateUser({ data }));
        }
      };
      SIGN_IN_CHANNEL.addEventListener("message", handleAutoConnection);
      return () =>
        SIGN_IN_CHANNEL.removeEventListener("message", handleAutoConnection);
    }
  }, [dispatch, connected]);

  return (
    <BoxGradient
      overflow='hidden'
      display='relative'
      sx={{
        "& *": { ...scrollBarSx },
        "& > div": {
          display: "flex",
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        "& > div > div": { display: "flex", flex: 1 },
        "& > div > #router-container": {
          display: (connected ? loaded : true) ? "flex" : "none",
        },
      }}>
      <Fade in={!loaded && connected && !isConference} unmountOnExit>
        <Box>
          <Cover />
        </Box>
      </Fade>
      <Fade
        in={connected ? isConference || loaded : true}
        unmountOnExit
        key={connected ? "connected" : "disconnected"}>
        <Box id='router-container'>
          <ErrorNetwork />
          <RouterProvider router={router(connected)} />
        </Box>
      </Fade>
      {/* <TestSocket /> */}
    </BoxGradient>
  );
}

export default App;
