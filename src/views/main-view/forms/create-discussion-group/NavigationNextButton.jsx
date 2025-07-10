import React, { useMemo } from "react";
import { useWatch } from "react-hook-form";

import { Button } from "@mui/material";
import PropTypes from "prop-types";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";

const NavigationNextButton = ({ setTab, control }) => {
  const members = useWatch({ control, name: "members" });

  const isActive = useMemo(() => {
    return Array.isArray(members) && members.length > 0;
  }, [members]);

  return (
    <Button
      variant='outlined'
      disabled={!isActive}
      onClick={() => setTab("create")}
      endIcon={<NavigateNextOutlinedIcon />}>
      Suivant
    </Button>
  );
};

NavigationNextButton.propTypes = {
  setTab: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
};

export default React.memo(NavigationNextButton);
