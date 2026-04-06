import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import ViewCozyOutlinedIcon from '@mui/icons-material/ViewCozyOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { updateConferenceData } from '@/redux/conference/conference';
import RemoteUserInfo from './RemoteUserInfo';
import LocalUserInfo from './LocalUserInfo';

const Header = () => {
  const dispatch = useDispatch();
  const userId = useSelector((store) => store.user.id);
  const activeId = useSelector(
    (store) => store.conference.meeting.actions.localPresentation.view.activeId
  );
  const showAll = useSelector(
    (store) => store.conference.meeting.actions.localPresentation.view.showAll
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

  const isLocalView = activeId === userId && !showAll;
  const isRemoteView = activeId && activeId !== userId && !showAll;

  return (
    <Toolbar
      sx={{
        position: 'relative',
      }}
    >
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="row"
        alignItems="center"
        pr={1}
      >
        {isLocalView && <LocalUserInfo />}
        {isRemoteView && <RemoteUserInfo id={activeId} />}
      </Box>
      {activeId && (
        <Tooltip
          title={`${showAll ? 'Masquer' : 'Afficher'} toutes les présentations`}
        >
          <div>
            <IconButton onClick={handleShowAllViews}>
              {showAll ? <CloseOutlinedIcon /> : <ViewCozyOutlinedIcon />}
            </IconButton>
          </div>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default Header;
