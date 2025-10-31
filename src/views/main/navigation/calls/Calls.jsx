import { Stack, Toolbar, Typography, ListSubheader } from '@mui/material';
import { useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import groupCall from './groupCall';
import CreateCallButton from './CreateCallButton';
import FilterCallButton from './FilterCallButton';
import RunningCallItem from './RunningCallItem';
import ScheduledCallItem from './ScheduledCallItem';
import CallItem from './CallItem';
import toggleFullscreen from '../../../../utils/toggleFullscreen';
import VirtualList from '../../../../components/VirtualList';
import { updateData } from '../../../../redux/data/data';
import CallDetailsView from './CallDetailsView';
import { ItemWrapperFocus } from '../../../../components/BlinkWrapper';
import { updateConferenceData } from '../../../../redux/conference/conference';

export default function Calls() {
  const bulkCalls = useSelector((store) => store.data.app.calls);
  const [type, setType] = useState('all');
  const dispatch = useDispatch();
  const calls = useMemo(() => groupCall(bulkCalls, type), [bulkCalls, type]);

  const handleOpenDetails = useCallback(
    (call) => () => {
      console.log(call);
      dispatch(
        updateData({
          key: 'app.actions.calls.info',
          data: { call, open: true },
        })
      );
    },
    [dispatch]
  );

  const handleCallAction = useCallback(
    (call) => () => {
      const url = import.meta.env.BASE_URL + `/conference/${call.id}`;
      let target = call?.location;
      const type = call?.room ? 'room' : 'direct';
      window.open(url, '_blank');
      dispatch(
        updateConferenceData({
          key: 'callTarget',
          data: { type, ...target },
        })
      );
    },
    [dispatch]
  );

  const data = useMemo(
    () =>
      calls.map((call, index, calls) => {
        const id = call?.id;
        const participants = call?.participants;
        const guests = call?.guests;

        return (
          <div key={id}>
            <ItemWrapperFocus id={id} location="calls">
              {call?.type === 'label' && (
                <ListSubheader sx={{ height: '100%' }} disableSticky>
                  {call?.label}
                </ListSubheader>
              )}

              {call?.status === 'running' && (
                <RunningCallItem
                  location={call?.location}
                  divider={call?.status === calls[index + 1]?.status}
                  createdAt={call?.createdAt}
                  createdBy={call?.createdBy}
                  incoming={call?.incoming}
                  onClickDetail={handleOpenDetails(call)}
                  onCallAction={handleCallAction(call)}
                  participants={
                    Array.isArray(participants) && Array.isArray(guests)
                      ? participants.length + guests.length
                      : undefined
                  }
                />
              )}
              {call?.status === 'scheduled' && (
                <ScheduledCallItem
                  location={call?.location}
                  divider={call?.status === calls[index + 1]?.status}
                  code={call?.id}
                  title={call?.title}
                  description={call?.description}
                  startedAt={call?.startedAt}
                  endedAt={call?.endedAt}
                  // onCallAction={handleCallAction(call)}
                  onClickDetail={handleOpenDetails(call)}
                />
              )}

              {['started', 'ended', 'failed'].includes(call?.status) && (
                <CallItem
                  location={call?.location}
                  divider={call?.status === calls[index + 1]?.status}
                  createdAt={call?.createdAt}
                  // createdBy={call?.createdBy}
                  onCallAction={handleCallAction(call)}
                  calls={call?.calls?.length}
                  incoming={call?.incoming}
                  failed={call?.status === 'failed'}
                  action="accepted"
                  onClickDetail={handleOpenDetails(call)}
                />
              )}
            </ItemWrapperFocus>
          </div>
        );
      }),
    [calls, handleOpenDetails, handleCallAction]
  );

  return (
    <>
      <Stack spacing={1} px={1} pb={1}>
        <Toolbar variant="dense">
          <Typography
            variant="h5"
            flexGrow={1}
            onDoubleClick={() => toggleFullscreen(document.body)}
          >
            Appels
          </Typography>
          <CreateCallButton />
        </Toolbar>
        <div>
          <FilterCallButton type={type} onChange={(_, type) => setType(type)} />
        </div>
      </Stack>
      <VirtualList data={data} emptyMessage="Aucun appel trouvé" />
      <CallDetailsView onCallAction={handleCallAction} />
    </>
  );
}
