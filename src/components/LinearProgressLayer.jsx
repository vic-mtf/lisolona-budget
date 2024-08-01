import { LinearProgress, Fade, useTheme } from "@mui/material";
import PropTypes from "prop-types";

export default function LinearProgressLayer({
  open = false,
  style,
  LinearProgressProps,
}) {
  const theme = useTheme();

  return (
    <Fade
      in={open}
      unmountOnExit
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: theme.zIndex.drawer + 300,
        backgroundColor: theme.palette.background.paper + "88",
        ...(typeof style === "function" ? style(theme) : style),
      }}>
      <div>
        <LinearProgress {...LinearProgressProps} />
      </div>
    </Fade>
  );
}

LinearProgressLayer.propTypes = {
  open: PropTypes.bool.isRequired,
  style: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  LinearProgressProps: PropTypes.object,
};
