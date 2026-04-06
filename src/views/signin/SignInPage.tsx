import {
  Card,
  Box,
  CardContent,
  LinearProgress,
  Fade,
  Backdrop,
  Dialog,
  Alert,
  Typography,
  useMediaQuery,
} from "@mui/material";
import BoxGradient from "@/components/BoxGradient";
import Content from "./content/Content";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import useAxios from "@/hooks/useAxios";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { SIGN_IN_CHANNEL } from "@/utils/broadcastChannel";
import type { RootState } from "@/redux/store";

export default function SignInPage() {
  const [{ loading }, refresh] = useAxios(
    { url: "/" },
    { manual: true }
  );
  const connected = useSelector((store: RootState) => store.user.connected);
  const isSmall = useMediaQuery("@media (max-width: 410px)");

  useEffect(() => {
    const handleAutoConnection = () => {
      if (window.opener) window.close();
    };
    SIGN_IN_CHANNEL.addEventListener("message", handleAutoConnection);
    return () => {
      SIGN_IN_CHANNEL.removeEventListener("message", handleAutoConnection);
    };
  }, []);

  return (
    <BoxGradient
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{ minHeight: "100vh" }}
    >
      <Box
        height={460}
        display="flex"
        sx={{
          width: isSmall ? "auto" : 400,
          mx: isSmall ? 1 : 0,
        }}
      >
        <Card
          sx={{
            bgcolor: (theme) =>
              theme.palette.background.paper + theme.customOptions.opacity,
            display: "flex",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            flex: 1,
            flexDirection: "column",
            position: "relative",
          }}
        >
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
            }}
          >
            <Header />
            <Content loading={loading} refresh={refresh} />
          </CardContent>
        </Card>
      </Box>
      <Footer />
      <Backdrop
        open={loading}
        sx={{
          bgcolor: (theme) => theme.palette.background.paper + "88",
          zIndex: (theme) => theme.zIndex.drawer + 100,
        }}
      />
      <Dialog
        open={connected}
        PaperProps={{
          sx: {
            border: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Alert>
          Vous avez réussi à vous connecter à votre compte.
          {window.opener ? (
            <Typography
              variant="body2"
              component="a"
              href={window.opener?.location?.href || "/"}
              target={window.opener ? "_blank" : "_self"}
              color="primary.main"
              fontWeight="bold"
              sx={{ textDecoration: "none", ml: 0.5 }}
            >
              Continuer la navigation
            </Typography>
          ) : (
            " Cette fenêtre va se fermer."
          )}
        </Alert>
      </Dialog>
    </BoxGradient>
  );
}
