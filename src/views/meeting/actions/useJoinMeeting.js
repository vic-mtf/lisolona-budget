import { useSelector } from "react-redux";
import useAxios from "../../../utils/useAxios";
import { useCallback } from "react";
import store from "../../../redux/store";
import { setData } from "../../../redux/meeting";
import setGlobalData from "../../../utils/setData";
import useJoinedAndPublishedLocalClient from "./useJoinedAndPublishedLocalClient";
import { useSocket } from "../../../utils/SocketIOProvider";
import { addParticipants } from "../../../redux/conference";
import { isPlainObject } from "lodash";

export default function useJoinMeeting() {
  const token = useSelector((store) => store.user.token);
  const [, refetch] = useAxios(
    { headers: { Authorization: `Bearer ${token}` } },
    { manual: true },
  );

  const handleUserJoined = useJoinedAndPublishedLocalClient();
  const socket = useSocket();
  const handleJoinMeetingRequest = useCallback(
    async (meetingId, client) => {
      const result = await refetch({
        url: "/api/chat/room/call/" + meetingId,
      });
      const meetingData = result?.data;
      if (isPlainObject(meetingData)) {
        const id = store.getState().user?.id;
        const uid = meetingData?.participants?.find(
          ({ identity: { _id } }) => _id === id,
        )?.uid;
        const options = meetingData?.callDetails;
        const {
          createdAt,
          location,
          participants,
          _id: meetingId,
        } = meetingData;

        store.dispatch(
          addParticipants({
            participants: participants.map((participant) => ({
              ...participant,
              id: participant?.identity._id,
              state:
                participant?.identity._id === id
                  ? {
                      ...participant.state,
                      isInRoom: true,
                    }
                  : participant.state,
            })),
          }),
        );

        if (client !== "guest") {
          setGlobalData({ meetings: [meetingData] });
          socket.emit("join", { id: meetingId });
        }
        const data = {
          data: {
            options,
            createdAt,
            location,
            meetingId,
            ...(await handleUserJoined({
              ...options,
              CHANEL: location,
              uid,
            })),
          },
        };
        store.dispatch(setData(data));
      }
      return meetingData;
    },
    [refetch, handleUserJoined, socket],
  );
  return handleJoinMeetingRequest;
}
