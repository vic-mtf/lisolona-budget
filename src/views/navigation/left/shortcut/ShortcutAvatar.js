import React, { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import Avatar from "../../../../components/Avatar";
import { generateColorsFromId } from "../../../../utils/genColorById";
import getShort from "../../../../utils/getShort";
import useSocket from "../../../../hooks/useSocket";

export default function ShortcutAvatar({ name, avatarSrc, id, len, title }) {
  const { background, text } = generateColorsFromId(id);
  const uid = useSelector((store) => store.user.id);
  const socket = useSocket();
  const isEmited = useRef(true);
  const avatarSx = useMemo(
    () => ({
      color: text,
      bgcolor: background,
      fontWeight: "bold",
      fontSize: 15,
    }),
    [background, text]
  );

  useEffect(() => {
    if (isEmited.current) {
      socket?.emit("signal", {
        details: { type: "connexion", uid, id },
        to: id,
        type: "room",
      });
      isEmited.current = false;
    }
  }, [socket, id, uid]);

  return (
    <Avatar
      src={avatarSrc}
      srcSet={avatarSrc}
      alt={name}
      children={getShort(name, len)}
      title={title}
      sx={{ ...avatarSx }}
    />
  );
}
