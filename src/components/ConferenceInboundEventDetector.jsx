import useCamOrMicEmitChange from '../hooks/events/useCamOrMicEmitChange';
import useHandleError from '../hooks/events/useHandleError';
import useRemoteUserJoin from '../hooks/events/useRemoteUserJoin';
import useRemoteUserLeave from '../hooks/events/useRemoteUserLeave';
import useRemoteUserSignal from '../hooks/events/useRemoteUserSignal';
import useRemoteUserUpdate from '../hooks/events/useRemoveUserUpdate';
import useAutoJoin from '../hooks/events/useAutoJoin';
import useUpdateOrganizerAuth from '../hooks/events/useUpdateOrganizerAuth';
import useRequestJoinRoom from '../hooks/events/useRequestJoinRoom';

export default function ConferenceInboundEventDetector() {
  useRemoteUserJoin();
  useRemoteUserLeave();
  useRemoteUserSignal();
  useCamOrMicEmitChange();
  useRemoteUserUpdate();
  useHandleError();
  useAutoJoin();
  useUpdateOrganizerAuth();
  useRequestJoinRoom();
  return null;
}
