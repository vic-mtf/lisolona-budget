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
import useAxios from "../../hooks/useAxios";
import ErrorNetwork from "../error/ErrorNetwork";
import Footer from "./footer/Footer";
import { useSelector } from "react-redux";

import Link from "../../components/Link";
import Dialog from "../../components/Dialog";

export default function SignInPage() {
  const [{ loading }, refresh] = useAxios("", { manual: true });
  const connected = useSelector((store) => store.user.connected);

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
        open={connected}
        PaperProps={{
          sx: { border: (theme) => `1px solid ${theme.palette.divider}` },
        }}>
        <Alert>
          Vous avez réussi à vous connecter à votre compte et pouvez accéder à
          la plate-forme pour{" "}
          <Link component='a' href='/' target='_black'>
            continuer la navigation
          </Link>
          .
        </Alert>
      </Dialog>
    </Box>
  );
}
