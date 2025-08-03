import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import CoPresentOutlinedIcon from "@mui/icons-material/CoPresentOutlined";
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined";

import {
  setConferenceData,
  togglePinId,
} from "../../../../../redux/conference";
import store from "../../../../../redux/store";

const PushPinOutlined = (props) => {
  return <PushPinOutlinedIcon {...props} sx={{ transform: "rotate(45deg)" }} />;
};

const UnpinOutlined = (props) => {
  return (
    <PushPinOutlined {...props}>
      <rect x='5' y='11' width='14' height='2' />
    </PushPinOutlined>
  );
};

export default function optionsData({ pined, id }) {
  return [
    {
      label: pined
        ? "Retirer sur la présentation"
        : "Mettre sur la présentation",
      icon: pined ? (
        <CancelPresentationOutlinedIcon />
      ) : (
        <CoPresentOutlinedIcon />
      ),
      onClick() {
        store.dispatch(
          togglePinId({
            pinId: id,
          })
        );
      },
    },
  ];
}
