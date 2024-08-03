import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import Discussions from "./discussions/Discussions";

const tabs = [
  {
    label: "Discussions",
    icon: ForumOutlinedIcon,
    id: "chats",
    component: Discussions,
  },
  {
    label: "Appels",
    icon: CallOutlinedIcon,
    id: "calls",
    component: "div",
  },
  {
    label: "Contacts",
    icon: PermContactCalendarOutlinedIcon,
    id: "contacts",
    component: "div",
  },
  {
    label: "Notifications",
    icon: NotificationsOutlinedIcon,
    id: "notifications",
    component: "div",
  },
];

export default tabs;
