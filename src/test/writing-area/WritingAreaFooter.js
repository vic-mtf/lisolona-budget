import React from "react";
import "@draft-js-plugins/text-alignment/lib/plugin.css";
import { WritingAreaToolbar } from "./WritingArea";
import {
  Paper,
  ToggleButtonGroup as TBG,
  ToggleButton,
  alpha,
  styled,
  Box as MuiBox,
  Fab,
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

export const ToggleButtonGroup = styled((props) => (
  <TBG
    size='small'
    onMouseDown={(event) => event.preventDefault()}
    onMouseUp={(event) => event.preventDefault()}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: `.01px solid transparent`,
    "&.Mui-disabled": { border: `.01px solid transparent` },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

export const CustomPaper = styled((props) => (
  <Paper elevation={0} {...props} />
))(({ theme }) => ({
  display: "flex",
  background: alpha(
    theme.palette.common[theme.palette.mode === "light" ? "black" : "white"],
    0.08
  ),
  flexWrap: "wrap",
}));

const WritingAreaFooter = ({
  editorState,
  setEditorState,
  hasFocusRef,
  onFocus,
}) => {
  const disabled = !hasFocusRef?.current;

  return (
    <WritingAreaToolbar>
      {() => (
        <MuiBox
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            p: 0.5,
          }}>
          <div
            style={{
              flexGrow: 1,
            }}></div>

          <Fab
            size='small'
            variant='circular'
            color='primary'
            sx={{
              borderRadius: 1,
            }}>
            <SendOutlinedIcon />
          </Fab>
        </MuiBox>
      )}
    </WritingAreaToolbar>
  );
};

export default WritingAreaFooter;
