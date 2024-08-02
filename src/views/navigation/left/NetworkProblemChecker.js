import useOnLine from "../../../hooks/useOnLine";
import { Alert, Slide } from "@mui/material";
import SignalWifiBadOutlinedIcon from "@mui/icons-material/SignalWifiBadOutlined";
import { useEffect, useMemo } from "react";
import useSocket from "../../../hooks/useSocket";

export default function NetworkProblemChecker({ direction = "up" }) {
  const online = useOnLine();
  const date = useMemo(() => ({ value: new Date() }), []);
  const socket = useSocket();

  useEffect(() => {
    if (online) socket?.emit("last", { date: date.value });
    else date.value = new Date();
  }, [online, socket, date]);

  return (
    <Slide in={!online} direction={direction} unmountOnExit>
      <Alert icon={<SignalWifiBadOutlinedIcon />} severity='warning'>
        votre appareil n'est plus relié au réseau Internet.
      </Alert>
    </Slide>
  );
}
