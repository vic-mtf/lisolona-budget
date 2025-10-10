import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import GridLayoutView from '../../../../../components/GridLayoutView';
import useActiveParticipants from '../../agora-actions-wrapper/hooks/useActiveParticipants';
import LocalParticipantGridView from '../local-participant-view/LocalParticipantGridView';
import { useSelector } from 'react-redux';
import RemoteParticipantView from '../remote-participant-view/RemoteParticipantView';
import SpeakerView from './SpeakerView';

const LiveInteractionGridView = React.forwardRef((_, ref) => {
  const participants = useActiveParticipants();
  const userId = useSelector((store) => store.user.id);
  const mode = useSelector(
    (store) => store.conference.meeting.view.localParticipant.mode
  );

  const data = useMemo(() => {
    let arr = [];
    if (mode === 'grid')
      arr = [{ id: userId, children: <LocalParticipantGridView /> }];
    for (let i = 0; i < participants.length; ++i) {
      const id = participants[i].identity.id;
      arr.push({
        id,
        children: <RemoteParticipantView id={id} />,
      });
    }
    return arr;
  }, [participants, userId, mode]);

  return (
    <>
      <Box
        width={'100%'}
        height={'100%'}
        ref={ref}
        display="flex"
        overflow="hidden"
      >
        <GridLayoutView data={data} />
      </Box>
      <SpeakerView />
    </>
  );
});

LiveInteractionGridView.displayName = 'LiveInteractionGridView';
export default React.memo(LiveInteractionGridView);
