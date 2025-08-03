import { Box } from "@mui/material";
import { useLayoutEffect } from "react";
import SetupRoom from "./setup-room/SetupRoom";

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
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flex: 1,
      }}>
      <SetupRoom />
    </Box>
  );
};

export default Conference;
