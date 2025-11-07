import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import { motion, AnimatePresence } from 'framer-motion';
import ActiveView from './ActiveView';
import SmallViewItem from './RemoteSmallViewItem';
import GridLayoutView from '../../../../../../components/GridLayoutView';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { updateConferenceData } from '../../../../../../redux/conference/conference';
import { useCallback } from 'react';
import LocalSmallViewItem from './LocalSmallViewItem';
import LocalActiveView from './LocalActiveView';

const VIEWS = [
  {
    id: 1,
    name: 'Dashboard',
    color: '#667eea',
    content: '📊',
    description: 'Tableau de bord',
  },
  {
    id: 2,
    name: 'Projets',
    color: '#f093fb',
    content: '📁',
    description: 'Mes projets',
  },
  // {
  //   id: 3,
  //   name: 'Messages',
  //   color: '#4facfe',
  //   content: '💬',
  //   description: 'Messagerie',
  // },
  // {
  //   id: 4,
  //   name: 'Calendrier',
  //   color: '#43e97b',
  //   content: '📅',
  //   description: 'Planning',
  // },
  // {
  //   id: 5,
  //   name: 'Paramètres',
  //   color: '#fa709a',
  //   content: '⚙️',
  //   description: 'Configuration',
  // },
  // {
  //   id: 6,
  //   name: 'Analytics',
  //   color: '#feca57',
  //   content: '📈',
  //   description: 'Statistiques',
  // },
];
const now = Date.now();
const MultiViewManager = () => {
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
    for (let i = 0; i < VIEWS.length; ++i) {
      const view = VIEWS[i];
      const id = Math.round(view.id * now).toString(16);
      arr.push({
        id: view.id,
        children: (
          <SmallViewItem
            key={id}
            id={id}
            index={i + 1}
            onClick={() => onSelectView(id)}
            activeView={activeView}
            color={view.color}
            name={view.name}
            content={view.content}
          />
        ),
      });
    }
    return arr;
  }, [activeView, onSelectView, screenShared, userId, isActiveLocalView]);

  return (
    <Box
      sx={{
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        flex: 1,
      }}
    >
      <AnimatePresence mode="wait">
        {!showAllViews ? (
          activeView && null
        ) : (
          // <ActiveView
          //   key="single-view"
          //   activeView={activeView}
          //   // name={VIEWS[activeView].name}
          //   // content={VIEWS[activeView].content}
          //   // description={VIEWS[activeView].description}
          // />
          <motion.div
            key="all-views"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              overflow: 'auto',
            }}
          >
            <Box
              sx={{
                width: { xs: '100%', md: '70%', lg: '60%' },
                height: { xs: '100%', lg: '60%' },
              }}
            >
              <GridLayoutView data={data} bgcolor="transparent" elevation={0} />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      <LocalActiveView isActive={!showAllViews && isActiveLocalView} />
    </Box>
  );
};
MultiViewManager.propTypes = {
  showAllViews: PropTypes.bool,
  //onClose: PropTypes.func,
  activeView: PropTypes.number,
  onSelectView: PropTypes.func,
};

export default React.memo(MultiViewManager);
