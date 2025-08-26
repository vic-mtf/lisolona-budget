import React, { useState, useMemo } from "react";
import { Tooltip, Dialog } from "@mui/material";
import useSmallScreen from "../../../../../hooks/useSmallScreen";
import { useCallback } from "react";
import { CustomIconButton } from "../SplitButton";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DeviceSetting from "../device-setting/DeviceSetting";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const SettingButton = React.memo(({ onClose: onCloseCallback }) => {
  const [open, setOpen] = useState(false);
  const loading = useSelector((store) => store.conference.setup.loading);
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
          <CustomIconButton
            onClick={() => {
              setOpen(true);
              if (typeof onCloseCallback === "function") onCloseCallback();
            }}
            disabled={loading}>
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
SettingButton.propTypes = {
  onClose: PropTypes.func,
};
SettingButton.displayName = "SettingButton";

export default SettingButton;
