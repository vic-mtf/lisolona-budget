import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDispatch } from 'react-redux';
import { updateConferenceData } from '@/redux/conference/conference';

const InfosHeader = () => {
  const dispatch = useDispatch();

  return (
    <Box>
      <Toolbar sx={{ gap: 2, px: 1 }}>
        <IconButton
          edge="start"
          onClick={() =>
            dispatch(
              updateConferenceData({
                key: ['meeting.nav.open'],
                data: [false],
              })
            )
          }
        >
          <CloseOutlinedIcon />
        </IconButton>
        <Typography variant="h6" fontSize={18}>
          Information de la réunion
        </Typography>
      </Toolbar>
    </Box>
  );
};

export default InfosHeader;
