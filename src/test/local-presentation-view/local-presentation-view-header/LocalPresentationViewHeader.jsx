import React from "react";
import ToolBar from "@mui/material/Toolbar";
import Slide from "@mui/material/Slide";
import PropTypes from "prop-types";
import MoreMenuStyles from "./MoreMenuStyles";
import Typography from "@mui/material/Typography";
import TabController from "./TabControler";

const LocalPresentationViewHeader = () => {
  return (
    <Slide
      direction='up'
      in={true}
      unmountOnExit
      appear={false}
      style={{
        //width: "100%",
        // position: "absolute",
        top: 0,
        left: 0,
        right: 0,
      }}>
      <ToolBar variant='dense' sx={{ bgcolor: "background.paper" }}>
        <MoreMenuStyles />
        <Typography ml={1} flexGrow={1}>
          L’écran est partagé avec votre audience
        </Typography>
        <TabController />
      </ToolBar>
    </Slide>
  );
};

LocalPresentationViewHeader.propTypes = {
  drawing: PropTypes.bool,
  onToggleDrawing: PropTypes.func,
  mode: PropTypes.string,
};

export default React.memo(LocalPresentationViewHeader);
