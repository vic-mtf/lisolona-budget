import { useEffect } from "react";
import useSocket from "../../../../hooks/useSocket";
import store from "../../../../redux/store";
import {
  setConferenceData,
  updateParticipantState,
} from "../../../../redux/conference";
import { isPlainObject } from "@reduxjs/toolkit";

export default function useSignalUpdate() {
  const socket = useSocket();

  useEffect(() => {
    const handleSignal = async (event) => {
      if (store.getState().meeting.meetingId === event?.where?._id) {
        const users = Array.isArray(event?.who) ? event?.who : [event?.who];
        const ids = users.map((user) =>
          typeof user === "string" ? user : user?._id
        );
        const [key] = Object.keys(event.what);
        const data = { ids, ...event.what, key };
        store.dispatch(updateParticipantState({ data }));
        if (isPlainObject(event?.what?.state)) {
          const [id] = event.who;
          if (
            Object.keys(event?.what?.state).includes("autoPinScreen") &&
            store.getState().meeting.me.id !== id
          ) {
            const autoPinScreen = event?.what?.state?.autoPinScreen;
            store.dispatch(
              setConferenceData({
                data: {
                  presenting: autoPinScreen,
                  pinId: autoPinScreen ? id : null,
                },
              })
            );
          }
        }

        //         {who: Array(1), where: {…}, what: {…}}
        // what
        // :
        // state
        // :
        // {autoPinScreen: false}
        // [[Prototype]]
        // :
        // Object
        // where
        // :
        // {_id: 'ea646b428'}
        // who
        // :
        // ['65329f5c68ee46682d7e1a14']

        // socket.emit("signal", {
        //     id: store.getState().meeting.meetingId,
        //     type: "state",
        //     obj: { autoPinScreen: stateScreenSharing },
        //     who: [store.getState().meeting?.me?.id],
        //   });
        // store.dispatch(setConferenceData({data: {

        // }}));
      }
    };
    socket?.on("signal", handleSignal);
    return () => {
      socket.off("signal", handleSignal);
    };
  }, [socket]);
}
