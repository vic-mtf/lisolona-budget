import ringtones from "../../../../../utils/ringtones";
import { Tooltip } from "@mui/material";
import { CustomIconButton } from "../SplitButton";
import SpeakerOutlinedIcon from "@mui/icons-material/SpeakerOutlined";

const SpeakerButton = () => {
  return (
    <Tooltip title='Tester la sortie audio'>
      <div>
        <CustomIconButton
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
