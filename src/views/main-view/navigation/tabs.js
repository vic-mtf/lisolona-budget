import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import Discussions from "./discussions/Discussions";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Calls from "./calls/Calls";
import Contacts from "./contacts/Contacts";
import Notices from "./notices/Notices";

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
    component: Calls,
  },
  {
    label: "Contacts",
    icon: PermContactCalendarOutlinedIcon,
    id: "contacts",
    component: Contacts,
  },
  {
    label: "Notifications",
    icon: NotificationsOutlinedIcon,
    id: "notifications",
    component: Notices,
  },
  {
    label: "Paramètres",
    icon: SettingsOutlinedIcon,
    id: "settings",
    component: "div",
    disabled: true,
  },
];

export default tabs;
