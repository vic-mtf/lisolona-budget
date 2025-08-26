import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

const navActions = [
  {
    id: "chats",
    icon: ChatOutlinedIcon,
    label: "Messages",
  },
  {
    id: "participants",
    icon: PeopleAltOutlinedIcon,
    label: "Participants",
  },
  {
    id: "infos",
    icon: InfoOutlinedIcon,
    label: "Infos",
  },
  {
    id: "authParams",
    icon: AdminPanelSettingsOutlinedIcon,
    label: "Administration",
  },
];

export default navActions;
