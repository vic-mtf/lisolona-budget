import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MeetingTimer from "../../../../components/MeetingTimer";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyOutlinedICon from "@mui/icons-material/ContentCopyOutlined";
import DoneOutLinedIcon from "@mui/icons-material/DoneOutlined";
import Fade from "@mui/material/Fade";
import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const InfoPanel = () => {
  const start = useSelector((store) => !store.conference.loading);
  const { code } = useParams();

  return (
    <Box display='flex' flexDirection='row'>
      <Typography variant='body2'>
        <MeetingTimer start={start} paused={false} />
      </Typography>
      <Divider flexItem orientation='vertical' sx={{ mx: 1 }} />
      <CopyCodeButton code={code} />
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
    <Fade in={Boolean(code)}>
      <Tooltip title={done ? "Copié !" : "Copier le code"}>
        <Typography>
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
            {code}
          </Button>
        </Typography>
      </Tooltip>
    </Fade>
  );
};

export default InfoPanel;
