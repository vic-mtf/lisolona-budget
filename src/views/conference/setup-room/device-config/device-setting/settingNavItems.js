import SpeakerOutlinedIcon from "@mui/icons-material/SpeakerOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import TroubleshootOutlinedIcon from "@mui/icons-material/TroubleshootOutlined";
import Diagnostic from "./diagnostic/Diagnostic";
import VideoSetting from "./video-setting/VideoSetting";

const settingNavItems = [
  {
    label: "Audio",
    value: "audio",
    icon: SpeakerOutlinedIcon,
  },
  {
    label: "Vidéo",
    value: "video",
    icon: VideocamOutlinedIcon,
    component: VideoSetting,
  },
  {
    label: "Diagnostic",
    value: "diagnostic",
    icon: TroubleshootOutlinedIcon,
    component: Diagnostic,
  },
];

export default settingNavItems;
