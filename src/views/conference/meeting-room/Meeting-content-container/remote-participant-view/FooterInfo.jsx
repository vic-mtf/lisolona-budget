import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import WavingHand from "../../../../../components/WavingHand";
import getFullName from "../../../../../utils/getFullName";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const FooterInfo = ({ id }) => {
  const identity = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.identity
  );
  const handRaised = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.state?.handRaised
  );
  const name = getFullName(identity);

  return (
    <Box
      sx={{
        zIndex: 1,
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        display: "flex",
        py: 1,
      }}>
      <Typography
        flexGrow={1}
        pl={1}
        sx={{ textShadow: "1px 1px 2px black", fontSize: ".8rem" }}
        variant='body2'>
        {name}
      </Typography>
      {handRaised && (
        <Box position='absolute' right={0} pr={1}>
          <WavingHand />
        </Box>
      )}
    </Box>
  );
};

FooterInfo.propTypes = {
  id: PropTypes.string,
};

export default FooterInfo;
