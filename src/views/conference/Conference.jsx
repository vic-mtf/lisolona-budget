import { Box } from "@mui/material";
import { useLayoutEffect, useEffect } from "react";
import SetupRoom from "./setup-room/SetupRoom";
import { useSelector } from "react-redux";
import { streamSegmenter } from "../../utils/StreamSegmenter";
import { noiseSuppressor } from "../../utils/NoiseSuppressor";

const Conference = () => {
  useLayoutEffect(() => {
    const handleBeforeUnload = (e) => {
      const message =
        "Si vous rechargez la page, vous perdrez les informations saisies.";
      e.preventDefault();
      return message;
    };

    // window.addEventListener("beforeunload", handleBeforeUnload);
    // return () => {
    //   window.removeEventListener("beforeunload", handleBeforeUnload);
    // };
  }, []);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flex: 1,
        }}>
        <SetupRoom />
      </Box>
      <ListerStream />
    </>
  );
};

const ListerStream = () => {
  const filter = useSelector(
    (store) => store.conference.setup.devices.processedCameraStream.filter
  );
  const blurred = useSelector(
    (store) => store.conference.setup.devices.processedCameraStream.blurred
  );
  const enhanced = useSelector(
    (store) => store.conference.setup.devices.processedCameraStream.enhanced
  );
  const background = useSelector(
    (store) =>
      store.conference.setup.devices.processedCameraStream.background.enabled
  );
  const suppressor = useSelector(
    (store) =>
      store.conference.setup.devices.processedMicrophoneStream.noiseSuppressor
  );

  useEffect(() => {
    if (background) streamSegmenter.enableStyle("replaceBackground");
    if (blurred) streamSegmenter.enableStyle("blur");
    if (enhanced) streamSegmenter.enableStyle("enhance");
    if (filter) {
      streamSegmenter.enableStyle("filter");
      streamSegmenter.setFilterType(filter);
    }

    noiseSuppressor.toggleProcessing(suppressor);

    return () => {
      streamSegmenter.resetStyles();
    };
  }, [filter, blurred, enhanced, background, suppressor]);
};

export default Conference;
