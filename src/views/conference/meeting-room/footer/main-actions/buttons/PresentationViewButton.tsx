import ViewCarouselOutlinedIcon from '@mui/icons-material/ViewCarouselOutlined';
import React from 'react';
import ActionButton from './ActionButton';
import { useDispatch, useSelector } from 'react-redux';
import { updateConferenceData } from '../../../../../../redux/conference/conference';

const PresentationViewButton = ({ onClose }) => {
  const isPresentationView = useSelector(
    (store) => store.conference.meeting.view.layoutView === 'presentation'
  );
  const dispatch = useDispatch();

  return (
    <ActionButton
      id="presentation"
      title="Vue de présentation"
      // disabled
      onClick={() => {
        dispatch(
          updateConferenceData({
            key: 'meeting.view.layoutView',
            data: isPresentationView ? 'liveInteractionGrid' : 'presentation',
          })
        );
        if (typeof onClose === 'function') onClose();
      }}
      selected={isPresentationView}
    >
      <ViewCarouselOutlinedIcon />
    </ActionButton>
  );
};

export default React.memo(PresentationViewButton);
