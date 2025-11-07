import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ViewCozyOutlinedIcon from '@mui/icons-material/ViewCozyOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { updateConferenceData } from '../../../../../../redux/conference/conference';

const Header = () => {
  const dispatch = useDispatch();
  const showAll = useSelector(
    (state) => state.conference.meeting.actions.localPresentation.view.showAll
  );

  const handleShowAllViews = useCallback(
    () =>
      dispatch(
        updateConferenceData({
          key: ['meeting.actions.localPresentation.view.showAll'],
          data: [!showAll],
        })
      ),
    [dispatch, showAll]
  );

  return (
    <Toolbar sx={{ bgcolor: 'background.paper' }}>
      <Tooltip
        title={`${showAll ? 'Masquer' : 'Afficher'} toutes les présentations`}
      >
        <div>
          <IconButton onClick={handleShowAllViews}>
            {showAll ? <CloseOutlinedIcon /> : <ViewCozyOutlinedIcon />}
          </IconButton>
        </div>
      </Tooltip>
      <Typography ml={2} variant="h6" fontSize={18}>
        {showAll ? 'Toutes les présentations' : 'Présentation'}
      </Typography>
    </Toolbar>
  );
};

export default Header;
