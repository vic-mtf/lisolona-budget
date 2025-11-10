import React from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import LocalPresentationView from '../local-presentation-view/LocalPresentationView';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

const LocalActiveView = () => {
  const userId = useSelector((store) => store.user.id);
  const enabled = useSelector(
    (store) => store.conference.setup.devices.screen.enabled
  );
  const showAllViews = useSelector(
    (store) => store.conference.meeting.actions.localPresentation.view.showAll
  );
  const activeView = useSelector(
    (store) => store.conference.meeting.actions.localPresentation.view.activeId
  );
  const isActive = userId === activeView && !showAllViews;

  return (
    <AnimatePresence>
      {enabled && (
        <Box
          component={motion.div}
          layout
          initial={{ scale: 0.8, opacity: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: isActive ? 1 : 0.8,
            opacity: isActive ? 1 : 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            borderRadius: 1,
            display: 'flex',
            zIndex: isActive ? 1 : -1,
          }}
        >
          <LocalPresentationView />
        </Box>
      )}
    </AnimatePresence>
  );
};

LocalActiveView.propTypes = {
  isActive: PropTypes.bool,
};

export default React.memo(LocalActiveView);
