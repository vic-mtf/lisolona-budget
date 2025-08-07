import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import { useSelector } from "react-redux";
import ListSubheader from "@mui/material/ListSubheader";

const CamerasList = () => {
  const cameras = useSelector(
    (store) => store.conference.setup.devices.cameras
  );
  const camera = useSelector((store) => store.conference.setup.devices.camera);

  console.log(camera);

  return (
    <Box sx={{ mt: 1 }}>
      <ListSubheader sx={{ bgcolor: "transparent" }}>Caméra</ListSubheader>
      <TextField
        value={camera?.deviceId || ""}
        onChange={(e) => {
          //dispatch(setCamera(e.target.value));
        }}
        select
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position='start'>
                <VideocamOutlinedIcon color='currentColor' />
              </InputAdornment>
            ),
          },
        }}>
        {cameras.map((camera) => (
          <MenuItem
            key={camera.deviceId}
            value={camera.deviceId}
            selected={false}>
            {camera.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default CamerasList;
