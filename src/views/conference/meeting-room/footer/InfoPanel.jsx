import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MeetingTimer from "../../../../components/MeetingTimer";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyOutlinedICon from "@mui/icons-material/ContentCopyOutlined";
import DoneOutLinedIcon from "@mui/icons-material/DoneOutlined";
import { useState } from "react";
import PropTypes from "prop-types";
import { useRef } from "react";

const InfoPanel = () => {
  return (
    <Box display='flex' flexDirection='row'>
      <Typography variant='body2'>
        <MeetingTimer start={true} paused={false} />
      </Typography>
      <Divider flexItem orientation='vertical' sx={{ mx: 1 }} />
      <CopyCodeButton code='ae4c5scl9' />
    </Box>
  );
};

const CopyCodeButton = ({ code }) => {
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);
  const handleCopy = async () => {
    clearTimeout(timerRef.current);
    await navigator.clipboard.writeText(code);
    setDone(true);
    timerRef.current = setTimeout(() => setDone(false), 1000);
  };

  return (
    <Tooltip title={done ? "Copié !" : "Copier le code"}>
      <Button
        sx={{
          p: 0,
          m: 0,
          "& .MuiButton-endIcon": { opacity: 0 },
          "&:hover": { "& .MuiButton-endIcon": { opacity: 1 } },
        }}
        onClick={handleCopy}
        color='inherit'
        size='small'
        endIcon={done ? <DoneOutLinedIcon /> : <ContentCopyOutlinedICon />}>
        <Typography variant='body2'>{code}</Typography>
      </Button>
    </Tooltip>
  );
};

CopyCodeButton.propTypes = {
  code: PropTypes.string.isRequired,
};

export default InfoPanel;
