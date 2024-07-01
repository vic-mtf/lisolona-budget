import { useLayoutEffect, useState } from "react";
import store from "../../../../redux/store";
import compareArrays from "../../../../utils/compareArrays";

export default function useClientState({ id, props = [], key = "state" }) {
  const [ClientStates, setClientStates] = useState(
    handleGetUserState({ id, props, key }),
  );

  console.log(ClientStates);

  useLayoutEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const updateStates = handleGetUserState({ id, props, key });
      if (!compareArrays([updateStates], [ClientStates]))
        setClientStates(updateStates);
    });
    return () => {
      unsubscribe();
    };
  }, [id, ClientStates, props, key]);

  return ClientStates;
}

const handleGetUserState = ({ id, props, key }) => {
  const Client = store
    .getState()
    .conference.participants.find((participant) => participant.id === id);
  const states = Client ? Client[key] : undefined;
  const uid = Client?.uid;
  const data = { id, uid };
  if (states) props.forEach((prop) => (data[prop] = states[prop]));
  return props.length ? data : { ...data, ...states };
};
