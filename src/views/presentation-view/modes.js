import React from "react";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import TrendingFlatOutlinedIcon from "@mui/icons-material/TrendingFlatOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import RectangleOutlinedIcon from "@mui/icons-material/RectangleOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import PaletteIcon from "@mui/icons-material/Palette";

export const modes = [
  {
    id: "persist",
    label: "Crayon",
    icon: CreateOutlinedIcon,
    type: "mode",
  },
  {
    id: "ephemeral",
    label: "Crayon éphémère",
    icon: BrushOutlinedIcon,
    type: "mode",
  },
  {
    id: "form",
    label: "Figures",
    icon: CategoryOutlinedIcon,
    children: [
      {
        id: "line",
        label: "Ligne",
        icon: ShowChartOutlinedIcon,
        type: "mode",
      },
      {
        id: "arrow",
        label: "Flèche",
        type: "mode",
        icon: TrendingFlatOutlinedIcon,
      },
      {
        id: "rect",
        label: "Rectangle",
        icon: RectangleOutlinedIcon,
        type: "mode",
      },
      {
        id: "circle",
        label: "Cercle",
        icon: CircleOutlinedIcon,
        type: "mode",
      },
    ],
  },

  {
    id: "text",
    label: "Texte",
    icon: TextFieldsOutlinedIcon,
    type: "mode",
    disabled: true,
  },
  {
    id: "gum",
    label: "Gomme",
    icon: AutoFixHighOutlinedIcon,
    type: "mode",
  },
  {
    id: "color",
    label: "Couleurs",
    icon: PaletteIcon,
    type: "color",
    children: [
      {
        id: "#000000",
        label: "Noir",
      },
      {
        id: "#ff1744",
        label: "Rouge",
      },

      {
        id: "#651fff",
        label: "Violet",
      },
      {
        id: "#2979ff",
        label: "Bleu",
      },
      {
        id: "#00e5ff",
        label: "Cyan",
      },
      {
        id: "#00e676",
        label: "Vert",
      },
      {
        id: "#ffea00",
        label: "Jaune",
      },
      {
        id: "#ff3d00",
        label: "Orange",
      },
      {
        id: "#ffffff",
        label: "Blanc",
      },
    ].map((data) => ({
      ...data,
      type: "color",
      icon: (props) =>
        React.createElement(PaletteIcon, {
          size: "small",
          ...props,
          sx: {
            color: data.id,
            border: (theme) => `2px inset ${theme.palette.divider}`,
            borderRadius: 50,
          },
        }),
    })),
  },
  {
    id: "eraser",
    label: "Tout effacer",
    icon: CleaningServicesOutlinedIcon,
    disabled: true,
  },
];
