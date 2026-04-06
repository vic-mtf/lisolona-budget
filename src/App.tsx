import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import BoxGradient from "@/components/BoxGradient";
import router from "@/router/router";
import { decrypt } from "@/utils/crypt";
import { updateUser } from "@/redux/user";
import scrollBarSx from "@/utils/scrollBarSx";
import { Box, Fade } from "@mui/material";
import Cover from "@/views/cover/Cover";
import { SIGN_IN_CHANNEL } from "@/utils/broadcastChannel";
import ErrorNetwork from "@/components/ErrorNetwork";
import SignInPage from "@/views/signin/SignInPage";
import type { RootState } from "@/redux/store";

const isSignInRoute = window.location.pathname.includes("/account/signin");

export default function App() {
  const connected = useSelector((store: RootState) => store.user.connected);
  const loaded = useSelector((store: RootState) => store.data.app.loaded);
  const dispatch = useDispatch();
  const isConference = /\/conference\/\w+/.test(window.location.pathname);

  useEffect(() => {
    if (!connected) {
      const handleAutoConnection = (event: MessageEvent) => {
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

  if (isSignInRoute) return <SignInPage />;

  return (
    <BoxGradient
      overflow="hidden"
      display="relative"
      sx={{
        "& *": { ...scrollBarSx },
      }}
    >
      <Fade
        in={!loaded && connected && !isConference}
        unmountOnExit
        timeout={500}
        appear={false}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div>
          <Cover />
        </div>
      </Fade>
      <Fade
        in={connected ? isConference || loaded : true}
        unmountOnExit
        key={connected ? "connected" : "disconnected"}
        timeout={500}
        appear={false}
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: "absolute",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <ErrorNetwork />
          <RouterProvider router={router(connected)} />
        </Box>
      </Fade>
    </BoxGradient>
  );
}
