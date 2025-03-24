import FormatBoldOutlinedIcon from "@mui/icons-material/FormatBoldOutlined";
import FormatItalicOutlinedIcon from "@mui/icons-material/FormatItalicOutlined";
// import SubscriptOutlinedIcon from "@mui/icons-material/SubscriptOutlined";
// import SuperscriptOutlinedIcon from "@mui/icons-material/SuperscriptOutlined";
import StrikethroughSOutlinedIcon from "@mui/icons-material/StrikethroughSOutlined";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import FormatSizeOutlinedIcon from "@mui/icons-material/FormatSizeOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import FormatListNumberedOutlinedIcon from "@mui/icons-material/FormatListNumberedOutlined";
//import IntegrationInstructionsOutlinedIcon from "@mui/icons-material/IntegrationInstructionsOutlined";
import { RichUtils } from "draft-js";

const buttons = [
  {
    id: "bold",
    label: "Gras",
    icon: FormatBoldOutlinedIcon,
    type: "text-format",
    style: "inline",
  },
  {
    id: "italic",
    label: "Italique",
    icon: FormatItalicOutlinedIcon,
    type: "text-format",
    style: "inline",
  },
  {
    id: "strikethrough",
    label: "Barré",
    icon: StrikethroughSOutlinedIcon,
    type: "text-format",
    style: "inline",
  },
  {
    id: "underline",
    label: "Souligné",
    icon: FormatUnderlinedIcon,
    type: "text-format",
    style: "inline",
  },
  {
    id: "code",
    label: "Code",
    icon: CodeOutlinedIcon,
    type: "code-format",
    style: "inline",
  },
  // {
  //   id: "code-block",
  //   label: "Bloque code",
  //   icon: IntegrationInstructionsOutlinedIcon,
  //   type: "code-format",
  //   style: "block",
  // },
  {
    id: "blockquote",
    label: "Citation",
    icon: FormatQuoteOutlinedIcon,
    type: "quote-format",
    style: "block",
  },
  {
    id: "size",
    label: "Taille",
    icon: FormatSizeOutlinedIcon,
    type: "size-format",
    style: "block",
  },
  {
    id: "unordered-list-item",
    label: "Liste à puce",
    icon: FormatListBulletedOutlinedIcon,
    type: "list-format",
    style: "block",
  },
  {
    id: "ordered-list-item",
    label: "Liste numérotée",
    icon: FormatListNumberedOutlinedIcon,
    type: "list-format",
    style: "block",
  },
  // {
  //   id: "superscript ",
  //   label: "Exposant au texte",
  //   icon: SuperscriptOutlinedIcon,
  //   replace: ["subscript"],
  //   type: "text-format",
  //   style: "inline"
  // },
  // {
  //   id: "subscript",
  //   label: "Indice au texte",
  //   icon: SubscriptOutlinedIcon,
  //   replace: ["superscript"],
  //   type: "text-format",
  //   style: "inline"
  // },
];

export const getButtons = (styleType) =>
  buttons.filter(({ type }) => styleType === type);

export const getStateToggleBlockStyle = (editorState, value) =>
  RichUtils.toggleBlockType(editorState, value);

export const EVENT_CHANGE_DATA = document.createElement("div");

export default buttons;
