import {
  createTheme,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Paper,
  Box as MuiBox,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import appConfig from "../../../../configs/app-config.json";
import AvatarStatus from "./AvatarStatus";
import IconButton from "../../../../components/IconButton";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MoreOption from "./more-options/MoreOption";
import { useTheme } from "@emotion/react";
//import CallButtons from './options-buttons/CallButtons';
import CallButton from "./options-buttons/CallButton";
import store from "../../../../redux/store";
import { addData } from "../../../../redux/data";

export default function ChatHeader({ target }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 0,
        bgcolor: "transparent",
        position: "absolute",
        width: "100%",
        backdropFilter: (theme) => `blur(${theme.customOptions.blur})`,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar variant="dense">
        <MuiBox
          display={{
            xs: "block",
            md: "none",
          }}
          mr={1}
        >
          <IconButton
            onClick={() => {
              store.dispatch(addData({ key: "target", data: null }));
            }}
          >
            <ArrowBackOutlinedIcon />
          </IconButton>
        </MuiBox>
        <AvatarStatus target={target} />
        <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
          <Tooltip title="Chercher" arrow>
            <div>
              <IconButton sx={{ mx: 1 }} disabled>
                <SearchOutlinedIcon fontSize="small" />
              </IconButton>
            </div>
          </Tooltip>
          <CallButton target={target} theme={theme} />
          <MoreOption theme={theme} target={target} />
        </ThemeProvider>
      </Toolbar>
    </Paper>
  );
}
