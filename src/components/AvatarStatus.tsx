import React from "react";
import ListAvatar from "./ListAvatar";
import useListenRemoteUserStatus from "../hooks/events/useListenRemoteUserStatus";

const AvatarStatus = React.memo(({ id, ...otherProps }) => {
  const status = useListenRemoteUserStatus(id);

  return (
    <ListAvatar
      {...otherProps}
      status={status === "online" ? status : "offline"}
      id={id}
    />
  );
});

AvatarStatus.displayName = "AvatarStatus";export default AvatarStatus;
