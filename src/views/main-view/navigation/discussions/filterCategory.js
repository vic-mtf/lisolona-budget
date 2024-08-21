// import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MarkChatUnreadOutlinedIcon from "@mui/icons-material/MarkChatUnreadOutlined";
import getFullName from "../../../../utils/getFullName";
import { escapeRegExp } from "lodash";
// import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
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
    label: "Favories",
    id: "favorite",
    icon: GradeOutlinedIcon,
  },
];

export function filterByCategory(item, currentCategory = "all") {
  if (currentCategory === "unread")
    return currentCategory === item?.message?.status;
  if (currentCategory === "room") return currentCategory === item.type;
  return true;
}

export function filterByName(item, search) {
  const keywords = search.trim().toLowerCase().split(/\s+/);
  const names = getFullName(item)?.toLowerCase()?.split(/\s+/);
  for (const keyword of keywords)
    if (
      names.find((name) => new RegExp(`^${escapeRegExp(keyword)}`).test(name))
    )
      return true;
  return search ? false : true;
}

export default filterCategory;
