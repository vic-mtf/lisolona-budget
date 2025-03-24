import { ListSubheader, Stack, Toolbar, Typography } from "@mui/material";
import { useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import VirtualizedList from "../../../../components/VirtualizedList";
import GuestItem from "./GuestItem";
import toggleFullscreen from "../../../../utils/toggleFullscreen";

export default function Notices() {
  const bulkNotifications = useSelector(
    (store) => store.data.app.notifications
  );
  // const [search, setSearch] = useState("");
  const notifications = useMemo(
    () => [
      {
        id: "efc248455ab",
        name: "Viael Mongolo",
        email: "phalphie@outlook.com",
        createdAt: new Date(),
      },
    ],
    [bulkNotifications]
  );

  const itemContent = useCallback(
    ({ index, style }) => {
      const data = notifications[index];
      const id = data?.id;
      return (
        <div key={data?.id} style={style}>
          {data?.type === "label" ? (
            <ListSubheader sx={{ height: "100%" }}>{data?.label}</ListSubheader>
          ) : (
            <GuestItem
              name={data?.name}
              image={data?.image}
              id={id}
              email={data?.email}
              createdAt={data?.createdAt}
              divider={index !== notifications.length - 1}
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
