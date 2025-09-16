import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import useSocket from "../hooks/useSocket";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const TestSocket = () => {
  const [user, setUser] = useState([]);
  const socket = useSocket();
  const notifications = useNotifications();
  const localUserId = useSelector((store) => store.user.id);

  useEffect(() => {
    const onJoinRoom = ({ userId }) => {
      setUser((users) => [...users, userId]);
      notifications.show(`User ${userId} joined`);
    };
    const onLeaveRoom = ({ userId }) => {
      setUser((users) => users.filter((_userId) => _userId !== userId));
      notifications.show(`User ${userId} left`);
    };
    const onSignalRoom = ({ userId, message }) => {
      notifications.show(`${userId}: ${message}`);
    };

    const onError = ({ message }) => {
      notifications.show(message, { severity: "error" });
    };

    socket.on("error-room", onError);
    socket.on("join-room", onJoinRoom);
    socket.on("leave-room", onLeaveRoom);
    socket.on("signal-room", onSignalRoom);
    return () => {
      socket.off("error-room", onError);
      socket.off("join-room", onJoinRoom);
      socket.off("leave-room", onLeaveRoom);
      socket.off("signal-room", onSignalRoom);
    };
  }, [socket, notifications, localUserId]);

  return (
    <Dialog open={false} fullWidth fullScreen>
      <DialogContent>
        {user.map((userId) => (
          <div key={userId}>{userId}</div>
        ))}
        <Button
          onClick={() => {
            socket.emit("join-room", { id: "test-room-id" });
          }}>
          Join test
        </Button>
        <Button
          onClick={() => {
            socket.emit("signal-room", { id: "test-room-id" });
          }}>
          signal
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TestSocket;
