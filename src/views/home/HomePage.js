import React, { useEffect, useMemo, useRef, useState } from "react";
import { Backdrop, Grid, Box as MuiBox, createTheme } from "@mui/material";

import CarouselPub from "./carousel-pub/CarouselPub";
import MainZone from "./MainZone";
import Header from "./Header";
import Footer from "../signin/footer/Footer";
import Typography from "../../components/Typography";
import Button from "../../components/Button";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import VideoLabelOutlinedIcon from "@mui/icons-material/VideoLabelOutlined";
import { useData } from "../../utils/DataProvider";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../../redux/meeting";
import { useLocation, useNavigate } from "react-router-dom";
import { updateValues } from "../../redux/user";

export default function HomePage() {
  const mode = useSelector((store) => store.meeting.mode);
  const subWindowRef = useRef();
  const [{ secretCode }] = useData();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const broadcastChannel = useMemo(
    () => new BroadcastChannel(`_geid_call_window_${secretCode}`),
    [secretCode]
  );

  useEffect(() => {
    const events = {
      subWindow: "_open_meeting_sub_window",
    };
    const onOpenMeetingSubWindow = (event) => {
      subWindowRef.current = event?.detail?.subWindow;
    };
    const onCloseSubWindow = ({ data }) => {
      if (data?.type === "mode" && data?.mode === "none") {
        dispatch(
          setData({
            data: { mode: data?.mode },
          })
        );
        dispatch(
          updateValues({
            token: undefined,
            name: undefined,
            id: undefined,
          })
        );
        navigateTo("/");
      }
    };
    broadcastChannel.addEventListener("message", onCloseSubWindow);
    CHANNEL.addEventListener(events.subWindow, onOpenMeetingSubWindow);
    return () => {
      CHANNEL.removeEventListener(events.subWindow, onOpenMeetingSubWindow);
      broadcastChannel.removeEventListener("message", onCloseSubWindow);
    };
  }, [broadcastChannel, dispatch, navigateTo]);

  return (
    <>
      <Grid container display='flex' flex={1} width='100%' overflow='auto'>
        <Grid
          item
          xs={12}
          md={6}
          p={0}
          m={0}
          display='flex'
          overflow='hidden'
          position='relative'
          flexDirection='column'
          height='100vh'
          sx={{
            background: (theme) =>
              theme.palette.background.paper + theme.customOptions.opacity,
            backdropFilter: (theme) => `blur(${theme.customOptions.blur})`,
          }}>
          <Header />
          <MainZone key={location.key} />
          <Footer />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          display='flex'
          alignItems='center'
          justifyContent='center'>
          <CarouselPub />
        </Grid>
      </Grid>
      <Backdrop
        open={mode !== "none"}
        sx={{
          background: (theme) =>
            theme.palette.background.paper + theme.customOptions.opacity,
          backdropFilter: (theme) => `blur(${theme.customOptions.blur})`,
          zIndex: (theme) => theme.zIndex.drawer,
          flexDirection: "column",
          gap: 2,
          p: 2,
        }}>
        <Typography variant='h5' maxWidth={700} align='center'>
          Merci d'avoir choisi notre service de vidéoconférence. Votre appel est
          en cours dans un autre onglet. Veuillez laisser l'onglet actuel ouvert
          pendant toute la durée de l'appel.
        </Typography>
        <MuiBox>
          <Button
            variant='outlined'
            color='inherit'
            onClick={() => subWindowRef.current?.focus()}
            sx={{
              color: "text.primary",
            }}
            endIcon={<LaunchOutlinedIcon />}
            startIcon={<VideoLabelOutlinedIcon />}>
            Retourner à la fenêtre d'appel en cours
          </Button>
        </MuiBox>
      </Backdrop>
    </>
  );
}

export const CHANNEL = document.createElement("div");
