import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useSelector } from "react-redux";
import ListSubheader from "@mui/material/ListSubheader";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";

const MicrophoneList = () => {
  const microphones = useSelector(
    (store) => store.conference.setup.devices.microphones
  );
  const microphone = useSelector(
    (store) => store.conference.setup.devices.microphone
  );

  return (
    <Box sx={{ mt: 1, mx: 1 }}>
      <ListSubheader
        sx={{ bgcolor: "transparent", position: "relative", px: 0 }}>
        Micro
      </ListSubheader>
      <TextField
        value={microphone?.deviceId || ""}
        onChange={(e) => {
          //dispatch(setmicrophone(e.target.value));
        }}
        select
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <MicNoneOutlinedIcon color='currentColor' />
              </InputAdornment>
            ),
          },
        }}>
        {microphones.map((microphone) => (
          <MenuItem
            key={microphone.deviceId}
            value={microphone.deviceId}
            selected={false}>
            {microphone.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default MicrophoneList;
