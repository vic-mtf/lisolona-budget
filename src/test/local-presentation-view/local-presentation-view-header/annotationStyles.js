import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import SsidChartOutlinedIcon from "@mui/icons-material/SsidChartOutlined";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import TextIncreaseOutlinedIcon from "@mui/icons-material/TextIncreaseOutlined";
import RectangleOutlinedIcon from "@mui/icons-material/RectangleOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import store from "../../../redux/store";

import {
  blue,
  cyan,
  green,
  orange,
  red,
  deepPurple,
  yellow,
  amber,
  lime,
  deepOrange,
  pink,
  teal,
} from "@mui/material/colors";
import ColorIcon from "./ColorIcon";

const annotationStyles = [
  {
    icon: DrawOutlinedIcon,
    label: "Crayon",
    id: "pencil",
    type: "mode",
  },
  {
    icon: BrushOutlinedIcon,
    label: "Crayon éphémère",
    id: "ephemeralPencil",
    type: "mode",
  },
  {
    icon: CategoryOutlinedIcon,
    label: "Figures",
    id: "figs",
    type: "mode",
    kinds: [
      {
        icon: SsidChartOutlinedIcon,
        label: "Ligne",
        id: "line",
      },
      {
        icon: RectangleOutlinedIcon,
        label: "Rectangle",
        id: "rectangle",
      },
      {
        icon: CircleOutlinedIcon,
        label: "Cercle",
        id: "circle",
      },
      {
        icon: ArrowRightAltOutlinedIcon,
        label: "Flèche",
        id: "arrow",
      },
    ],
  },
  {
    icon: TextIncreaseOutlinedIcon,
    label: "Ajouter le texte",
    id: "text",
    onClick: () => {
      const name = "__local_presentation_view_add_text";
      const customEvent = new CustomEvent(name, {});
      window.dispatchEvent(customEvent);
    },
  },
  {
    icon: ColorIcon,
    label: "Couleur",
    id: "color",
    type: "color",
    kinds: [
      {
        label: "Rouge",
        id: "red",
        color: red[500],
      },
      {
        label: "Vert",
        id: "green",
        color: green[500],
      },
      {
        label: "Bleu",
        id: "blue",
        color: blue[500],
      },
      {
        label: "orange",
        id: "orange",
        color: orange[500],
      },
      {
        label: "Cyan",
        id: "cyan",
        color: cyan[500],
      },
      {
        label: "Noir",
        id: "black",
        color: "black",
      },
      {
        label: "Blanc",
        id: "white",
        color: "white",
      },
      {
        label: "Violet",
        id: "deepPurple",
        color: deepPurple[500],
      },
      {
        label: "Jaune",
        id: "yellow",
        color: yellow[500],
      },
      {
        label: "Jaune clair",
        id: "amber",
        color: amber[500],
      },
      {
        label: "Vert clair",
        id: "lime",
        color: lime[500],
      },
      {
        label: "Orange clair",
        id: "deepOrange",
        color: deepOrange[500],
      },
      {
        label: "Rose",
        id: "pink",
        color: pink[500],
      },
      {
        label: "Turquoise",
        id: "teal",
        color: teal[500],
      },
    ],
  },
  {
    icon: AutoFixHighOutlinedIcon,
    label: "Gomme",
    id: "gum",
    type: "mode",
  },
  {
    icon: CleaningServicesOutlinedIcon,
    label: "Tout effacer",
    id: "clear",
  },
];

export const onChangeMode = (mode) => {
  store.dispatch({
    type: "conference/updateConferenceData",
    payload: {
      key: ["meeting.actions.localPresentation.annotation.mode"],
      data: [mode],
    },
  });
};

export const onChangeColor = (color) => {
  store.dispatch({
    type: "conference/updateConferenceData",
    payload: {
      key: ["meeting.actions.localPresentation.annotation.color"],
      data: [color],
    },
  });
};

export const findById = (obj, targetId) => {
  if (obj.id === targetId) return obj;
  if (Array.isArray(obj.kinds))
    for (const child of obj.kinds) {
      const result = findById(child, targetId);
      if (result) return result;
    }
  return null;
};

export default annotationStyles;
