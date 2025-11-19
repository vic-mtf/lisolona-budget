import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { motion, AnimatePresence } from 'framer-motion';
import RemoteActiveView from './RemoteActiveView';
import RemoteSmallViewItem from './RemoteSmallViewItem';
import GridLayoutView from '../../../../../../components/GridLayoutView';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { updateConferenceData } from '../../../../../../redux/conference/conference';
import { useCallback } from 'react';
import LocalSmallViewItem from './LocalSmallViewItem';
import useSharedScreensParticipants from '../../../agora-actions-wrapper/hooks/useSharedScreensParticipants';
import StopScreenShareOutlinedIcon from '@mui/icons-material/StopScreenShareOutlined';

const MultiViewManager = () => {
  const sharedScreensParticipants = useSharedScreensParticipants();

  const userId = useSelector((store) => store.user.id);
  const showAllViews = useSelector(
    (store) => store.conference.meeting.actions.localPresentation.view.showAll
  );
  const activeView = useSelector(
    (store) => store.conference.meeting.actions.localPresentation.view.activeId
  );
  const screenShared = useSelector(
    (store) => store.conference.setup.devices.screen.enabled
  );
  const dispatch = useDispatch();

  const onSelectView = useCallback(
    (index) => {
      dispatch(
        updateConferenceData({
          key: [
            'meeting.actions.localPresentation.view.activeId',
            'meeting.actions.localPresentation.view.showAll',
          ],
          data: [index, false],
        })
      );
    },
    [dispatch]
  );

  const isActiveLocalView = useMemo(
    () => activeView === userId,
    [activeView, userId]
  );

  const data = useMemo(() => {
    let arr = [];
    if (screenShared)
      arr = [
        {
          id: userId,
          children: (
            <LocalSmallViewItem
              onSelectView={onSelectView}
              selected={isActiveLocalView}
            />
          ),
        },
      ];
    for (let i = 0; i < sharedScreensParticipants.length; i++) {
      const p = sharedScreensParticipants[i];
      if (p.identity.id === userId) continue;
      const id = p.identity.id;
      const index = i + 1;
      const selected = id === activeView;

      arr.push({
        id,
        children: (
          <RemoteSmallViewItem
            key={id}
            user={p.identity}
            onSelectView={onSelectView}
            selected={selected}
            index={index}
          />
        ),
      });
    }
    return arr;
  }, [
    activeView,
    onSelectView,
    screenShared,
    userId,
    isActiveLocalView,
    sharedScreensParticipants,
  ]);

  const isActiveRemoteView = useMemo(
    () => activeView && activeView !== userId,
    [activeView, userId]
  );

  return (
    <AnimatePresence mode="popLayout">
      {!showAllViews ? (
        isActiveRemoteView && (
          <RemoteActiveView key="single-view" id={activeView} />
        )
      ) : (
        <motion.div
          key="all-views"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            gap: 10,
          }}
        >
          <Typography align="center" variant="h6" fontSize={24}>
            Toutes les présentations
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
              p: { xs: 1, md: 5, lg: 20, xl: 30 },
            }}
          >
            {data.length > 0 && (
              <GridLayoutView data={data} bgcolor="transparent" elevation={0} />
            )}
          </Box>
        </motion.div>
      )}
      {data.length === 0 && !screenShared && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Chip
            size="large"
            label="Aucune présentation partagée pour le moment."
            variant="outlined"
            icon={<StopScreenShareOutlinedIcon />}
          />
        </Box>
      )}
    </AnimatePresence>
  );
};

MultiViewManager.propTypes = {
  showAllViews: PropTypes.bool,
  //onClose: PropTypes.func,
  activeView: PropTypes.number,
  onSelectView: PropTypes.func,
};

export default React.memo(MultiViewManager);
