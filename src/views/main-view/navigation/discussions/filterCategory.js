// import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MarkChatUnreadOutlinedIcon from "@mui/icons-material/MarkChatUnreadOutlined";

const filterCategory = [
  {
    label: "Tous",
    id: "all",
    icon: "div",
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
];

export default filterCategory;
