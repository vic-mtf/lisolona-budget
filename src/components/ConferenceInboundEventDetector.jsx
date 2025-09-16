import useCamOrMicEmitChange from "../hooks/events/useCamOrMicEmitChange";
import useHandleError from "../hooks/events/useHandleError";
import useRemoteUserJoin from "../hooks/events/useRemoteUserJoin";
import useRemoteUserLeave from "../hooks/events/useRemoteUserLeave";
import useRemoteUserSignal from "../hooks/events/useRemoteUserSignal";
import useRemoteUserUpdate from "../hooks/events/useRemoveUserUpdate";
export default function ConferenceInboundEventDetector() {
  useRemoteUserJoin();
  useRemoteUserLeave();
  useRemoteUserSignal();
  useCamOrMicEmitChange();
  useRemoteUserUpdate();
  useHandleError();

  return null;
}
