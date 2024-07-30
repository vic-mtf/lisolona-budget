import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import BoxGradient from "./components/BoxGradient";
import router from "./router/router";
import { decrypt } from "./utils/crypt";
import { changeValues } from "./redux/user";
import { setData } from "./redux/meeting";
import scrollBarSx from "./utils/scrollBarSx";
import store from "./redux/store";
import { Box, Fade } from "@mui/material";
import Cover from "./views/cover/Cover";

const CHANNEL = new BroadcastChannel("_GEID_SIGN_IN_CONNECTION");

function App() {
  const connected = useSelector((store) => store.user.connected);
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let handleAutoConnection = (event) => {
      const { data } = event;
      if (data) dispatch(changeValues(decrypt(data)));
    };
    if (connected) dispatch(setData({ data: { me: store.getState().user } }));
    CHANNEL.addEventListener("message", handleAutoConnection);
    return () => CHANNEL.removeEventListener("message", handleAutoConnection);
  }, [connected, dispatch]);

  return (
    <BoxGradient
      overflow='hidden'
      display='relative'
      sx={{
        "& *": { ...scrollBarSx },
        "& > div; & > div > div": {
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
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
