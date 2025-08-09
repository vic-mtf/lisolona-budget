import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useSelector, useDispatch } from "react-redux";
import ListSubheader from "@mui/material/ListSubheader";
import SpeakerGroupOutlinedIcon from "@mui/icons-material/SpeakerGroupOutlined";
import { updateConferenceData } from "../../../../../../redux/conference/conference";
import ringtones from "../../../../../../utils/ringtones";

const SpeakerList = () => {
  const dispatch = useDispatch();
  const speakers = useSelector(
    (store) => store.conference.setup.devices.speakers
  );
  const speaker = useSelector(
    (store) => store.conference.setup.devices.speaker
  );

  const handleSpeakerChange = (speaker) => {
    dispatch(
      updateConferenceData({
        key: "setup.devices.speaker",
        data: speaker,
      })
    );
  };

  return (
    <Box sx={{ mt: 1, mx: 1 }}>
      <ListSubheader
        sx={{ bgcolor: "transparent", position: "relative", px: 0 }}>
        Enceinte à la sortie audio
      </ListSubheader>
      <TextField
        value={speaker?.deviceId || ""}
        onChange={(e) => {
          //dispatch(setspeaker(e.target.value));
        }}
        select
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <SpeakerGroupOutlinedIcon color='currentColor' />
              </InputAdornment>
            ),
          },
        }}>
        {speakers.map((speaker) => (
          <MenuItem
            key={speaker.deviceId}
            value={speaker.deviceId}
            selected={false}
            onClick={async () => {
              handleSpeakerChange(speaker);
              ringtones.test.pause();
              ringtones.test.currentTime = 0;
              ringtones.test.setSinkId(speaker?.deviceId);
              ringtones.test.play();
            }}>
            {speaker.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default SpeakerList;
