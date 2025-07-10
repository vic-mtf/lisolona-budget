import { ListSubheader, Stack, Toolbar, Typography } from "@mui/material";
import { useMemo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import ContactItem from "./ContactItem";
import groupContact from "./groupContacts";
import store from "../../../../redux/store";
import { updateData } from "../../../../redux/data/data";
import VirtualizedList from "../../../../components/VirtualizedList";
import InputSearch from "../../../../components/InputSearch";
import GuestContactButton from "./GuestContactButton";
import toggleFullscreen from "../../../../utils/toggleFullscreen";

export default function Contacts() {
  const bulkContacts = useSelector((store) => store.data.app.contacts);
  const discussionTarget = useSelector((store) => store.data.discussionTarget);
  const [search, setSearch] = useState("");
  const contacts = useMemo(
    () => groupContact(bulkContacts, search),
    [bulkContacts, search]
  );

  const itemContent = useCallback(
    ({ index, style }) => {
      const data = contacts[index];
      const id = data?.id;
      return (
        <div key={data?.id} style={style}>
          {data?.type === "label" ? (
            <ListSubheader sx={{ height: "100%" }}>{data?.label}</ListSubheader>
          ) : (
            <ContactItem
              selected={discussionTarget?.id === id}
              name={data?.name}
              image={data?.image}
              status={data?.status}
              id={id}
              email={data?.email}
              search={search}
              onClick={() =>
                store.dispatch(
                  updateData({
                    key: ["discussionTarget", "targetView"],
                    data: [
                      store
                        .getState()
                        .data.app.discussions.find((d) => d?.id === id) || data,
                      "messages",
                    ],
                  })
                )
              }
              onContextMenu={(event) => {
                event.preventDefault();
                // setItem((item) => ({
                //   contextMenu:
                //     item.contextMenu === null
                //       ? {
                //           mouseX: event.clientX + 2,
                //           mouseY: event.clientY - 6,
                //         }
                //       : null,
                //   data,
                // }));
              }}
              divider={data?.alpKey === contacts[index - 1]?.alpKey}
            />
          )}
        </div>
      );
    },
    [contacts, discussionTarget, search]
  );

  return (
    <>
      <Stack spacing={1} px={1} pb={1}>
        <Toolbar variant='dense'>
          <Typography
            variant='h5'
            flexGrow={1}
            onDoubleClick={() => toggleFullscreen(document.body)}>
            Contacts
          </Typography>
          <GuestContactButton />
        </Toolbar>
        <InputSearch
          placeholder='Recherche de contact'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Stack>
      <VirtualizedList
        data={contacts}
        itemContent={itemContent}
        rowHeight={({ index }) => (contacts[index].type === "label" ? 50 : 69)}
        emptyMessage='Aucun Contact trouvé'
      />
    </>
  );
}
