import React, { useState, useMemo } from "react";
import { Tooltip, Dialog } from "@mui/material";
import useSmallScreen from "../../../../../hooks/useSmallScreen";
import { useCallback } from "react";
import { CustomIconButton } from "../SplitButton";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DeviceSetting from "../device-setting/DeviceSetting";

const SettingButton = React.memo(() => {
  const [open, setOpen] = useState(false);

  const matches = useSmallScreen();
  const onClose = useCallback(() => setOpen(false), []);
  const navProps = useMemo(
    () => (matches ? { fullScreen: true } : {}),
    [matches]
  );

  return (
    <>
      <Tooltip arrow title='Paramètres'>
        <div>
          <CustomIconButton onClick={() => setOpen(true)}>
            <SettingsOutlinedIcon />
          </CustomIconButton>
        </div>
      </Tooltip>
      <Dialog
        open={open}
        {...navProps}
        onClose={onClose}
        maxWidth={matches ? undefined : "md"}>
        <DeviceSetting onClose={onClose} />
      </Dialog>
    </>
  );
});

SettingButton.displayName = "SettingButton";

export default SettingButton;
