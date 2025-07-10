import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MarkChatUnreadOutlinedIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import getFullName from "../../../../utils/getFullName";
import { escapeRegExp } from "lodash";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";

const filterCategory = [
  {
    label: "Tous",
    id: "all",
    icon: "div",
    // icon: ChatOutlinedIcon,
  },
  {
    label: "Non lues",
    id: "unread",
    icon: MarkChatUnreadOutlinedIcon,
  },
  {
    label: "Lisanga",
    id: "room",
    icon: GroupsOutlinedIcon,
  },
  {
    label: "Favoris",
    id: "favorite",
    icon: GradeOutlinedIcon,
    disabled: true,
  },
];

export function filterByCategory(item, currentCategory = "all") {
  if (currentCategory === "unread")
    return currentCategory === item?.message?.status;
  if (currentCategory === "room") return currentCategory === item.type;
  return true;
}

export function sortbyKey(data = [], sortType = "", reverse = false) {
  const getValue = (obj = {}, key) => {
    const keys = Array.isArray(key) ? key : [key];
    let val = null;
    keys.forEach((key) => {
      if (typeof obj === "object" && val === null && key in obj) val = obj[key];
    });
    return val;
  };

  return [...data].sort((_a, _b) => {
    if (sortType === "name") {
      const a = getValue(_a, ["name", "fistName"]);
      const b = getValue(_b, ["name", "fistName"]);
      return a > b ? (reverse ? -1 : 1) : a < b ? (reverse ? 1 : -1) : 0;
    }

    if (sortType === "update") {
      const a = new Date(getValue(_a, "updatedAt"));
      const b = new Date(getValue(_b, "updatedAt"));
      return (a.getTime() - b.getTime()) * (reverse ? 1 : -1);
    }
  });
}

export function filterByType(item, type) {
  return type === "group"
    ? item?.type === "room"
    : type === "all"
    ? true
    : item?.type !== "room";
}
export default filterCategory;

export const displays = [
  { id: "all", label: "Toutes les discussions", icon: ListOutlinedIcon },
  { label: "Contacts", id: "contact", icon: PersonOutlineOutlinedIcon },
  { label: "Lisanga", id: "group", icon: GroupsOutlinedIcon },
];

export const sortTypes = [
  { label: "Discussion récente", id: "update", icon: UpdateOutlinedIcon },
  { label: "Nom", id: "name", icon: BadgeOutlinedIcon },
];

export const orders = [
  { id: "asc", label: "Croissant" },
  { id: "desc", label: "Décroissant" },
];
