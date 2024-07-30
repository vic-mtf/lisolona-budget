import {
  Card,
  Box as MuiBox,
  CardContent,
  LinearProgress,
  Fade,
  Backdrop,
  Alert,
} from "@mui/material";
import Box from "../../components/Box";
import Content from "./content/Content";
import Header from "./header/Header";
import useAxios from "../../utils/useAxios";
import ErrorNetwork from "../error/ErrorNetwork";
import Footer from "./footer/Footer";
import { setUser } from "../../redux/app";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Link from "../../components/Link";
import Dialog from "../../components/Dialog";

const channel = new BroadcastChannel("_GEID_SIGN_IN_CONNECTION");

export default function SignInPage() {
  const [{ loading }, refresh] = useAxios("", { manual: true });
  const [finished, setFinished] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const root = document.getElementById("root");
    const name = "_connected";
    let handleAutoConnexion = (event) => {
      const { user } = event.detail;
      dispatch(setUser(user));
      setFinished(true);
      channel.postMessage(user, window?.location?.origin);
      window.close();
    };
    root.addEventListener(name, handleAutoConnexion);
    return () => {
      root.removeEventListener(name, handleAutoConnexion);
    };
  }, [dispatch]);

  return (
    <Box justifyContent='center' alignItems='center'>
      <MuiBox
        height={460}
        display='flex'
        sx={{
          width: { xs: "auto", md: 400 },
          mx: { xs: 1, md: 0 },
        }}>
        <Card
          sx={{
            bgcolor: (theme) =>
              theme.palette.background.paper + theme.customOptions.opacity,
            display: "flex",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            flex: 1,
            flexDirection: "column",
            position: "relative",
          }}>
          <Fade in={loading}>
            <LinearProgress
              sx={{
                position: "absolute",
                width: "100%",
                zIndex: (theme) => theme.zIndex.drawer + 300,
              }}
            />
          </Fade>
          <CardContent
            sx={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
            }}>
            <Header />
            <Content loading={loading} refresh={refresh} />
          </CardContent>
        </Card>
      </MuiBox>
      <Footer />
      <Backdrop
        open={loading}
        sx={{
          bgcolor: (theme) => theme.palette.background.paper + "88",
          zIndex: (theme) => theme.zIndex.drawer + 100,
        }}
      />
      <ErrorNetwork />
      <Dialog
        open={finished}
        PaperProps={{
          sx: { border: (theme) => `1px solid ${theme.palette.divider}` },
        }}>
        <Alert>
          Vous avez réussi à vous connecter à votre compte et pouvez accéder à
          la plate-forme pour{" "}
          <Link {...propsLink}>continuer la navigation</Link>.
        </Alert>
      </Dialog>
    </Box>
  );
}

const propsLink = {
  component: "a",
  href: "/?autoconnexion=true",
  target: "_blank",
};
