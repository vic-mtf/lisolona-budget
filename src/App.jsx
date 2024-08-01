import { useEffect, useState } from "react";
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

function App() {
  const connected = useSelector((store) => store.user.connected);
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
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
  }, [connected, dispatch]);

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
      }}>
      <Fade in={!loaded && connected} unmountOnExit>
        <Box>
          <Cover
            setLoaded={setLoaded}
            key={connected ? "connected" : "disconnected"}
          />
        </Box>
      </Fade>
      <Fade in={loaded || !connected} unmountOnExit>
        <Box sx={{ display: connected && !loaded ? "none" : "flex" }}>
          <RouterProvider router={router(connected)} />
        </Box>
      </Fade>
    </BoxGradient>
  );
}

export default App;