import NoiseControlOffOutlinedIcon from "@mui/icons-material/NoiseControlOffOutlined";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import { useDispatch, useSelector } from "react-redux";
import { updateConferenceData } from "../../../../../../redux/conference/conference";

const NoiseControl = () => {
  const enabled = useSelector(
    (store) =>
      store.conference.setup.devices.processedMicrophoneStream.noiseSuppressor
  );

  const dispatch = useDispatch();

  const handleToggleNoiseControl = () => {
    dispatch(
      updateConferenceData({
        key: "setup.devices.processedMicrophoneStream.noiseSuppressor",
        data: !enabled,
      })
    );
  };
  return (
    <Box>
      <ListItem
        secondaryAction={
          <Switch checked={enabled} onChange={handleToggleNoiseControl} />
        }>
        <ListItemIcon>
          <NoiseControlOffOutlinedIcon />
        </ListItemIcon>
        <ListItemText
          primary='Bloquer les bruits autour de vous'
          secondary='diminue les sons ambiants pour que votre voix reste claire et bien audible pendant l’appel.'
          sx={{ maxWidth: "80%" }}
        />
      </ListItem>
    </Box>
  );
};

export default NoiseControl;
