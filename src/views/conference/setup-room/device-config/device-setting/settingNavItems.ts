import SpeakerOutlinedIcon from "@mui/icons-material/SpeakerOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import TroubleshootOutlinedIcon from "@mui/icons-material/TroubleshootOutlined";
import Diagnostic from "./diagnostic/Diagnostic";
import VideoSetting from "./video-setting/VideoSetting";
import AudioSetting from "./audio-setting/AudioSetting";

const settingNavItems = [
  {
    label: "Audio",
    value: "audio",
    icon: SpeakerOutlinedIcon,
    component: AudioSetting,
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
