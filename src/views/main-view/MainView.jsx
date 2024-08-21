import { CssBaseline, Box as MuiBox } from "@mui/material";
import React from "react";
import Navigation from "./navigation/Navigation";
import { useSelector } from "react-redux";

export default function MainView() {
  return (
    <MuiBox
      display='flex'
      flex={1}
      width='100%'
      flexDirection='column'
      position='relative'
      overflow='hidden'>
      <MuiBox sx={{ display: "flex", flex: 1, width: "100%" }}>
        <CssBaseline />
        <Navigation />
      </MuiBox>
    </MuiBox>
  );
}
