import { LinearProgress, Fade, styled, alpha } from "@mui/material";

const LinearProgressLayer = styled(
  ({ open = false, LinearProgressProps, ...otherProps }) => (
    <Fade in={open} unmountOnExit appear={false} {...otherProps}>
      <div>
        <LinearProgress {...LinearProgressProps} />
      </div>
    </Fade>
  )
)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: theme.zIndex.drawer + 300,
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
}));

export default LinearProgressLayer;
