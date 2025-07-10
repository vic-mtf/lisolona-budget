import { Stack, Toolbar, Typography } from "@mui/material";
import { useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import VirtualizedList from "../../../../components/VirtualizedList";
import GuestItem from "./GuestItem";
import toggleFullscreen from "../../../../utils/toggleFullscreen";
import store from "../../../../redux/store";
import getFullName from "../../../../utils/getFullName";

export default function Notices() {
  const bulkNotifications = useSelector(
    (store) => store.data.app.notifications
  );
  // const [search, setSearch] = useState("");
  const notifications = useMemo(
    () => groupGuestNotifications(bulkNotifications),
    [bulkNotifications]
  );

  const itemContent = useCallback(
    ({ index, style }) => {
      const data = notifications[index];
      const id = data?.id;
      return (
        <div key={data?.id} style={style}>
          {data.variant === "guest" && (
            <GuestItem
              name={data?.name}
              image={data?.image}
              id={id}
              email={data?.email}
              createdAt={data?.createdAt}
              divider={index !== notifications.length - 1}
              isRemote={data?.isRemote}
            />
          )}
        </div>
      );
    },
    [notifications]
  );

  return (
    <>
      <Stack spacing={1} px={1} pb={1}>
        <Toolbar variant='dense'>
          <Typography
            variant='h5'
            flexGrow={1}
            onDoubleClick={() => toggleFullscreen(document.body)}>
            Notifications
          </Typography>
        </Toolbar>
      </Stack>
      <VirtualizedList
        data={notifications}
        itemContent={itemContent}
        rowHeight={({ index }) =>
          notifications[index].type === "label" ? 50 : 136
        }
        emptyMessage='Aucune notification trouvée'
      />
    </>
  );
}

const groupGuestNotifications = (guests) => {
  const user = store.getState().user;

  return guests
    ?.map((guest) => {
      const isRemote = user?.id !== guest?.from?.id;

      const remoteUser = isRemote ? guest?.from : guest?.to;
      return {
        isRemote: user?.id !== guest?.from?.id,
        name: getFullName(remoteUser),
        ...guest,
      };
    })
    ?.sort(
      ({ createdAt: ac, updatedAt: au }, { createdAt: bc, updatedAt: bu }) =>
        (bu || bc) - (au || ac)
    );
};
