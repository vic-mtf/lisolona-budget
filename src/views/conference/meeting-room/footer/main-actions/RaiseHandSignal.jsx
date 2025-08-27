import { useSelector } from "react-redux";
import BorderAnimated from "../../../../../components/BorderAnimated";

const RaiseHandSignal = () => {
  const raiseHand = useSelector(
    (store) => store.conference.meeting.actions.raiseHand
  );
  return raiseHand && <BorderAnimated />;
};

export default RaiseHandSignal;
