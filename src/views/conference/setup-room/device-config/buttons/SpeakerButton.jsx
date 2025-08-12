import ringtones from "../../../../../utils/ringtones";
import { Tooltip } from "@mui/material";
import { CustomIconButton } from "../SplitButton";
import SpeakerOutlinedIcon from "@mui/icons-material/SpeakerOutlined";
import { useSelector } from "react-redux";

const SpeakerButton = () => {
  const loading = useSelector((store) => store.conference.setup.loading);
  return (
    <Tooltip title='Tester la sortie audio'>
      <div>
        <CustomIconButton
          disabled={loading}
          onClick={() => {
            ringtones.test.play();
          }}>
          <SpeakerOutlinedIcon />
        </CustomIconButton>
      </div>
    </Tooltip>
  );
};

export default SpeakerButton;
