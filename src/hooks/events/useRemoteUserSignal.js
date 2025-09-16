import { useEffect } from "react";
import useSocket from "../useSocket";
import store from "../../redux/store";
import { isPlainObject } from "@reduxjs/toolkit";
import getFullName from "../../utils/getFullName";
import { useNotifications } from "@toolpad/core/useNotifications";
import ringtones from "../../utils/ringtones";

const useRemoteUserSignal = () => {
  const socket = useSocket();
  const notifications = useNotifications();
  //update state or auth on store
  useEffect(() => {
    const oonHandleSignal = ({ participants = [], state, auth }) => {
      const members = store.getState().conference.meeting.participants;
      const data = {};
      for (let p of participants) {
        let update = false;
        const participant = Object.assign({}, members[p] || {});
        if (Object.keys(participant).length) {
          if (state) {
            participant.state = state;
            update = true;
          }
          if (auth) {
            participants.auth = auth;
            update = true;
          }
        }
        if (update) data[p] = { ...participant };
      }

      if (Object.keys(data).length)
        store.dispatch({
          type: "conference/updateConferenceData",
          payload: {
            data: { meeting: { participants: data } },
          },
        });
    };
    socket?.on("signal-room", oonHandleSignal);
    return () => {
      socket?.off("signal-room", oonHandleSignal);
    };
  }, [socket]);

  //raise hand signal
  useEffect(() => {
    const fname = (fullName) => fullName.trim().split(/\s+/)[0];
    const genNameSummary = (fullNames) => {
      const count = fullNames.length;
      const ft = fname(fullNames[0]);
      const lt = fname(fullNames[fullNames.length - 1]);
      if (!count) return "";
      if (count === 1) return fullNames[0];
      if (count === 2) return `${ft} et ${lt}`;
      if (count === 3) return `${ft}, ${lt} et 1 autre personne`;
      return `${ft}, ${lt} et ${count - 2} autres personnes`;
    };
    const onSignal = ({ state, participants = [] }) => {
      const members = store.getState().conference.meeting.participants;
      const names = [];
      const userId = store.getState().user.id;

      for (let p of participants) {
        const participant = members[p];
        if (participant && participant?.identity?.id !== userId) {
          names.push(getFullName(participant.identity));
          const prop = "handRaised";
          const key = names.join("") + prop;
          if (hasProp(state, prop) && !state.handRaised) {
            notifications.close(key);
            ringtones.lower.volume = 0.03;
            ringtones.lower.play();
          }
          if (hasProp(state, prop) && state?.handRaised) {
            const message =
              names > 1 ? "ont  levé leurs mains" : "a levé sa main";
            notifications.show(`${genNameSummary(names)} ${message}`, { key });
            ringtones.raise.volume = 0.05;
            ringtones.raise.play();
          }
        }
      }
    };
    socket?.on("signal-room", onSignal);
    return () => {
      socket?.off("signal-room", onSignal);
    };
  }, [socket, notifications]);
};

const hasProp = (obj, prop) => isPlainObject(obj) && prop in obj;

export default useRemoteUserSignal;
