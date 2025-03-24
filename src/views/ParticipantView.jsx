import React from "react";
import { Box, Chip, Paper, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import bgsrc from "../assets/52373794-femme-inquiète-et-pense-à-quelque-chose-qui-regarde-la-caméra.png";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import { useRef } from "react";
import FloatOptions from "./FloatOptions";

const ParticipantView = React.memo(({ index }) => {
  const rootRef = useRef();
  return (
    <Box
      ref={rootRef}
      display='flex'
      flex={1}
      m={0.5}
      component={Paper}
      overflow='hidden'
      position='relative'
      sx={{
        background: `url(${bgsrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        // backgroundBlendMode: "darken",
        // backgroundAttachment: "fixed",
      }}>
      <FloatOptions rootRef={rootRef} />
      <Box position='absolute' bottom={0} left={0} m={1}>
        <Chip
          label={"user name " + (index + 1)}
          deleteIcon={
            <IconButton
              size='small'
              sx={{
                bgcolor: (theme) => theme.palette.background.paper + "40",
              }}>
              <MicNoneOutlinedIcon
                fontSize='small'
                color='success'
                sx={{ textShadow }}
              />
            </IconButton>
          }
          onDelete={() => {}}
          sx={{
            borderRadius: 1,
            backdropFilter: "blur(15px)",
            textShadow,
          }}
        />
      </Box>
    </Box>
  );
});
const textShadow = (theme) => ` 0px 0px 4px ${theme.palette.common.black}`;
ParticipantView.displayName = "ParticipantView";

ParticipantView.propTypes = {
  index: PropTypes.number,
};
export default ParticipantView;
