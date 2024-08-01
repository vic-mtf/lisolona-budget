import { useContext } from "react";
import { MeetingDataContext } from "../components/MeetingProvider";

export const useMeetingData = () => useContext(MeetingDataContext);

export default useMeetingData;
