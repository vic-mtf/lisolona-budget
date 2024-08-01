import React, { useLayoutEffect } from "react";
import Typography from "../../../components/Typography";
import InputCode from "../../../components/InputCode";
import store from "../../../redux/store";
import { updateValues } from "../../../redux/user";
import useSocket from "../../../hooks/useSocket";

const CodeMeeting = ({ values, loading, refetch, codeRef }) => {
  const socket = useSocket();

  useLayoutEffect(() => {
    const handleDisconnect = () => socket?.disconnect();
    if (!store.getState().user.connected && socket) {
      store.dispatch(
        updateValues({
          token: undefined,
          name: undefined,
          id: undefined,
        })
      );
      socket.disconnect();
      socket.on("connection", handleDisconnect);
    }
    return () => {
      socket?.off("connection", handleDisconnect);
    };
  }, [socket]);

  return (
    <React.Fragment>
      <Typography>Entrez le code de la réunion pour participer</Typography>
      <InputCode
        length={9}
        size={35}
        values={values}
        onComplete={(code) => {
          codeRef.current = code.join("");
          if (!loading) {
            refetch({
              url: "api/chat/room/call/" + code.join(""),
            });
          }
        }}
      />
    </React.Fragment>
  );
};

export default CodeMeeting;
