import { ListSubheader, Stack, Toolbar, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ContactItem from "./ContactItem";
import groupContact from "./groupContacts";
import store from "../../../../redux/store";
import { updateData } from "../../../../redux/data/data";
import VirtualList from "../../../../components/VirtualList";
import InputSearch from "../../../../components/InputSearch";
import GuestContactButton from "./GuestContactButton";
import toggleFullscreen from "../../../../utils/toggleFullscreen";
import { ItemWrapperFocus } from "../../../../components/BlinkWrapper";
import { useCallback } from "react";
import MenuItems from "../../../../components/MenuItems";
import getCoordContextMenu from "../../../../utils/getCoordContextMenu";
import contactMenuItems from "./contactMenuItems";
import ConfirmDeleteContact from "./ConfirmDeleteContact";

export default function Contacts() {
  const bulkContacts = useSelector((store) => store.data.app.contacts);
  const discussionTarget = useSelector((store) => store.data.discussionTarget);
  const [menuItem, setMenuItem] = useState({ contextMenu: null, data: null });
  const [search, setSearch] = useState("");
  const contacts = useMemo(
    () => groupContact(bulkContacts, search),
    [bulkContacts, search]
  );

  const handleClickItem = useCallback(
    (contact) => () => {
      store.dispatch(
        updateData({
          key: ["discussionTarget", "targetView"],
          data: [
            {
              ...contact,
              type: "direct",
              members: [contact, store.getState().user],
              ...store
                .getState()
                .data.app.discussions.find((d) => d?.id === contact?.id),
            },
            "messages",
          ],
        })
      );
    },
    []
  );

  const data = useMemo(
    () =>
      contacts.map(({ id, ...contact }, index, contacts) => (
        <React.Fragment key={id}>
          {contact?.type === "label" ? (
            <ListSubheader sx={{ height: "100%" }}>
              {contact?.label}
            </ListSubheader>
          ) : (
            <ItemWrapperFocus id={id} location='contacts'>
              <ContactItem
                name={contact?.name}
                image={contact?.image}
                status={contact?.status}
                id={id}
                email={contact?.email}
                search={search}
                onClick={handleClickItem({ ...contact, id })}
                onContextMenu={(event) => {
                  const coords = getCoordContextMenu(event);
                  setMenuItem(({ contextMenu }) => ({
                    contextMenu: contextMenu === null ? coords : null,
                    data: { id, ...contact },
                  }));
                }}
                divider={contact?.alpKey === contacts[index - 1]?.alpKey}
                selected={discussionTarget?.id === id}
              />
            </ItemWrapperFocus>
          )}
        </React.Fragment>
      )),
    [contacts, discussionTarget, search, handleClickItem]
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
      <VirtualList data={data} emptyMessage='Aucun Contact trouvé' />
      <MenuItems
        {...menuItem}
        discussionTarget={discussionTarget}
        onClose={() => setMenuItem(({ data }) => ({ data, contextMenu: null }))}
        itemContent={() => contactMenuItems}
      />
      <ConfirmDeleteContact />
    </>
  );
}
