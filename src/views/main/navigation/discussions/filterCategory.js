import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MarkChatUnreadOutlinedIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";

const filterCategory = [
  {
    label: "Toutes",
    id: "all",
    icon: "div",
    // icon: ChatOutlinedIcon,
  },
  {
    label: "Non lues",
    id: "unread",
    icon: MarkChatUnreadOutlinedIcon,
    disabled: false,
  },
  {
    label: "Lisanga",
    id: "room",
    icon: GroupsOutlinedIcon,
    disabled: false,
  },
  {
    label: "Favoris",
    id: "favorite",
    icon: GradeOutlinedIcon,
    disabled: false,
  },
];

export function filterByCategory(item, currentCategory = "all") {
  if (currentCategory === "unread")
    return currentCategory === item?.message?.status;
  if (currentCategory === "room") return currentCategory === item.type;
  if (currentCategory === "favorite") return item?.favorites?.includes(item.id);

  return true;
}

export function sortbyKey(
  data = [],
  sortType = "",
  reverse = false,
  pins = []
) {
  const getValue = (obj = {}, key) => {
    const keys = Array.isArray(key) ? key : [key];
    let val = null;
    keys.forEach((key) => {
      if (typeof obj === "object" && val === null && key in obj) val = obj[key];
    });
    return val;
  };

  const sortedData = [...data].sort((_a, _b) => {
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
  return reorderArrayByIds(sortedData, pins);
}

export const filterByType = (item, type) => {
  return type === "group"
    ? item?.type === "room"
    : type === "all"
    ? true
    : item?.type !== "room";
};

export const reorderArrayByIds = (array1, array2) => {
  if (!Array.isArray(array1) || !Array.isArray(array2)) return [];

  const idSet = new Set(array2);
  const prioritized = array2
    .map((id) => {
      const item = array1?.find((item) => item && item.id === id);
      return item && { ...item, isPinned: array2.includes(item.id) };
    })
    .filter(Boolean);
  const remaining = array1.filter((item) => !idSet.has(item.id));

  return [...prioritized, ...remaining];
};

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

export default filterCategory;
