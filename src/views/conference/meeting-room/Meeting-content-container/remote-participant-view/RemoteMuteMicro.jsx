import { alpha, Fade, Typography } from "@mui/material";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

const RemoteMuteMicro = ({ id }) => {
  const isMicActive = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.state?.isMicActive
  );

  return (
    <Fade
      in={!isMicActive}
      appear={false}
      unmountOnExit
      style={{ zIndex: 1, position: "absolute", top: 0, right: 0 }}>
      <Box p={0.5}>
        <Box
          component={Typography}
          sx={{
            bgcolor: (t) => alpha(t.palette.common.black, 0.5),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "text.secondary",
            borderRadius: 1,
            p: 0.5,
          }}>
          <MicOffOutlinedIcon fontSize='small' />
        </Box>
      </Box>
    </Fade>
  );
};

RemoteMuteMicro.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default RemoteMuteMicro;
