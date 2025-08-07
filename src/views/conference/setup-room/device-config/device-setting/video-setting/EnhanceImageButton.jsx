import {
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import React from "react";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useDispatch, useSelector } from "react-redux";
import { updateConferenceData } from "../../../../../../redux/conference/conference";

const EnhanceImageButton = () => {
  const enhanced = useSelector(
    (state) => state.conference.setup.devices.processedCameraStream.enhanced
  );
  const dispatch = useDispatch();

  return (
    <ListItem
      disableGutters
      secondaryAction={
        <Box display='flex' alignItems='center'>
          <FormControlLabel
            value=''
            control={
              <Switch
                color='primary'
                checked={enhanced}
                onChange={() =>
                  dispatch(
                    updateConferenceData({
                      key: "setup.devices.processedCameraStream.enhanced",
                      data: !enhanced,
                    })
                  )
                }
              />
            }
          />
        </Box>
      }>
      <ListItemIcon>
        <AutoAwesomeRoundedIcon />
      </ListItemIcon>
      <ListItemText
        //sx={{ width: 100, bgcolor: "background.paper" }}
        primary='Booster la lumière'
        secondary='une meilleure visibilité, même en conditions de faible éclairage.'
        slotProps={{ secondary: { maxWidth: 320 } }}
      />
    </ListItem>
  );
};

export default React.memo(EnhanceImageButton);
