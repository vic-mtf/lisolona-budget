import { Box } from "@mui/material";
import { useLayoutEffect, useEffect } from "react";
import SetupRoom from "./setup-room/SetupRoom";
import { useSelector } from "react-redux";
import { streamSegmenter } from "../../utils/StreamSegmenter";

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
      <ListerStreamSegmenter />
    </>
  );
};

const ListerStreamSegmenter = () => {
  const filter = useSelector(
    (store) => store.conference.setup.devices.processedCameraStream.filter
  );
  const blurred = useSelector(
    (store) => store.conference.setup.devices.processedCameraStream.blurred
  );
  const enhanced = useSelector(
    (store) => store.conference.setup.devices.processedCameraStream.enhanced
  );

  useEffect(() => {
    // streamSegmenter.resetStyles();

    if (blurred) streamSegmenter.enableStyle("blur");
    if (enhanced) streamSegmenter.enableStyle("enhance");
    if (filter) {
      streamSegmenter.enableStyle("filter");
      streamSegmenter.setFilterType(filter);
    }

    return () => {
      streamSegmenter.resetStyles();
    };
  }, [filter, blurred, enhanced]);
};

export default Conference;
