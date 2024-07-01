import Box from "../../../../components/Box";
import GridDataDisplay from "./grid-system/GridDataDisplay";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import Participant from "./participant/Participant";
import React, { useEffect, useMemo } from "react";
import CameraView from "./camera-view/CameraView";
import { useSelector } from "react-redux";
import ActionsWrapper from "../actions/ActionsWrapper";
import Typography from "../../../../components/Typography";
import useGetClients from "../actions/useGetClients";
import ParticipantsGrid from "./participants-view/ParticipantsGrid";
import { Slide } from "@mui/material";
import ParticipantsPresentation from "./participants-view/ParticipantsPresentation";
import HandRaisedSignalAnimate from "./HandRaisedSignalAnimate";

export default function Content() {
  const [{ contentRootRef }] = useMeetingData();
  const presenting = useSelector((store) => store.conference.presenting);
  const cameraView = useSelector((store) => store.conference.cameraView);
  const members = useGetClients();

  const participants = useMemo(
    () => members.filter(({ active }) => active),
    [members]
  );

  //   const data = useMemo(() => {
  //     const data = [];
  //     if (cameraView === "content") data.push(<CameraView mode={cameraView} />);
  //     return data.concat(
  //       participants.map((participant) => (
  //         <Participant {...participant} key={participant.id} />
  //       ))
  //     );
  //   }, [cameraView, participants]);

  useEffect(() => {
    const handleDblclick = () => {
      if (document?.fullscreenElement) document?.exitFullscreen();
      else document.body.requestFullscreen();
    };
    document.addEventListener("dblclick", handleDblclick);
    return () => {
      document.removeEventListener("dblclick", handleDblclick);
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          flexDirection: "row",
          width: "100%",
        }}
        ref={contentRootRef}>
        {views.map(({ id, Component, props }) => (
          <Slide
            direction={id}
            in={id === "right" ? presenting : !presenting}
            style={{
              width: "100%",
              height: "100%",
              flex: 1,
              top: 0,
              left: 0,
              position: "absolute",
              display: "flex",
              overflow: "hidden",
            }}
            key={id}
            unmountOnExit>
            <div
              style={{
                display: "flex",
                flex: 1,
                overflow: "hidden",
                position: "relative",
              }}
              {...props}>
              <Component {...(id === "left" ? { participants } : {})} />
              {id === "left" && <CameraView mode={cameraView} />}
            </div>
          </Slide>
        ))}

        {/* <GridDataDisplay data={data} /> */}
        <HandRaisedSignalAnimate />
        {/* {participants.length === 0 && (
          <Typography
            variant='h5'
            position='absolute'
            width='100%'
            height='100%'
            display='flex'
            color='text.secondary'
            justifyContent='center'
            align='center'
            alignItems='center'>
            Merci de patienter, les autres participants arrivent bientôt.
          </Typography>
        )}
        {cameraView === "float" && <CameraView mode={cameraView} />} */}
      </Box>
      <ActionsWrapper />
    </>
  );
}
const views = [
  {
    id: "left",
    Component: ParticipantsGrid,
    //props: { style: { background: "red" } },
  },
  {
    id: "right",
    Component: ParticipantsPresentation,
    // props: { style: { background: "orange" } },
  },
];
