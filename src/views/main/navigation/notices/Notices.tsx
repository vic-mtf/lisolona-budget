import { Stack, Toolbar, Typography } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import GuestItem from "./GuestItem";
import toggleFullscreen from "@/utils/toggleFullscreen";
import VirtualList from "@/components/VirtualList";
import groupNotices from "./groupNotices";
import DeleteInvitationButton from "./DeleteInvitationButton";
import { ItemWrapperFocus } from "@/components/BlinkWrapper";
import ConfirmDeleteItem from "@/components/ConfirmDeleteItem";

export default function Notices() {
  const bulkNotifications = useSelector(
    (store) => store.data.app.notifications
  );
  const notifications = useMemo(
    () => groupNotices(bulkNotifications),
    [bulkNotifications]
  );

  const data = useMemo(
    () =>
      notifications?.map(({ id, user, createdAt, isRemote }, index, data) => {
        return (
          <div key={id}>
            <ItemWrapperFocus id={id} location='notifications'>
              <GuestItem
                user={user}
                id={id}
                createdAt={createdAt}
                isRemote={isRemote}
                index={index}
                data={data}
              />
            </ItemWrapperFocus>
          </div>
        );
      }),
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
      <VirtualList data={data} emptyMessage='Aucune notification trouvée' />
      <ConfirmDeleteItem
        location='notifications'
        title="Supprimer l'invitation"
        description={({ data }) => (
          <>
            {"Voulez-vous vraiment supprimer l'invitation de"}{" "}
            <Typography color='textPrimary' component='b' fontWeight='bold'>
              {data?.name}
            </Typography>
          </>
        )}
        deleteButton={({ data, onClose }) => (
          <DeleteInvitationButton data={data} onClose={onClose} />
        )}
      />
    </>
  );
}
