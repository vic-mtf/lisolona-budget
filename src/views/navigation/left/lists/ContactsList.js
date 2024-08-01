import React, { useCallback, useMemo, useRef, useState } from "react";
import { Divider, ListSubheader, MenuItem, Toolbar } from "@mui/material";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { useDispatch } from "react-redux";
import LoadingList from "./LoadingList";
import EmptyContentMessage from "./EmptyContentMessage";
import { addData } from "../../../../redux/data";
import InvitationRequestForm from "./InvitationRequestForm";
import { useLiveQuery } from "dexie-react-hooks";
import ContactItem from "../items/ContactItem";
import db from "../../../../database/db";
import CustomListItemsGroup from "../../../../components/CustomListItemsGroup";
import { escapeRegExp } from "lodash";
import SearchBar from "../SearchBar";
import IconButton from "../../../../components/IconButton";
import Button from "../../../../components/Button";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import Menu from "../../../../components/Menu";

export default function ContactList({ navigation }) {
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialog, setDialog] = useState(null);
  const anchorElRef = useRef();
  const contacts = useLiveQuery(() => db?.contacts.toArray(), []);

  const menuItems = [
    {
      Icon: PersonAddAlt1OutlinedIcon,
      label: "Inviter un contact",
      onClick() {
        setDialog("invitation");
      },
    },
    {
      Icon: GroupAddOutlinedIcon,
      label: "Créer nouveau Lisanga",
      disabled: true,
      onClick() {
        // setAnchorEl(null);
        // handleOpenMeeting('prepare');
        //<InvitationRequestForm/>
      },
    },
  ];
  return (
    <>
      <InvitationRequestForm
        open={dialog === "invitation"}
        onClose={() => setDialog(null)}
      />
      {navigation === 2 && (
        <React.Fragment>
          <Toolbar variant='dense'>
            <Button
              children='Démarrer une discussion'
              variant='outlined'
              color='inherit'
              ref={anchorElRef}
              sx={{ mx: "auto" }}
              startIcon={<AddCommentOutlinedIcon />}
              endIcon={<ExpandMoreOutlinedIcon />}
              onClick={() => {
                setAnchorEl(anchorElRef.current);
              }}
            />
          </Toolbar>
          <Toolbar variant='dense'>
            <SearchBar
              // onChangeSearch={onChangeSearch}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <IconButton disabled>
              <FilterListOutlinedIcon fontSize='small' />
            </IconButton>
          </Toolbar>
          <ListItems search={search} contacts={contacts} />
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            sx={{
              "& .MuiMenuItem-root": {
                "& .MuiSvgIcon-root": {
                  fontSize: 18,
                  color: (theme) => theme.palette.text.secondary,
                  marginRight: (theme) => theme.spacing(1.5),
                },
              },
            }}>
            {menuItems.map(({ label, Icon, disabled, onClick }, key) => (
              <MenuItem
                key={key}
                disabled={disabled}
                onClick={(event) => {
                  setAnchorEl(null);
                  onClick(event);
                }}>
                {<Icon fontSize='small' />} {label}
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      )}
    </>
  );
}

const ListItems = ({ contacts, search }) => {
  const dispatch = useDispatch();
  const { filteredObjects, letters, countByLetter } = useMemo(
    () => processObjects(contacts, search),
    [contacts, search]
  );

  const handleClickContact = useCallback(
    (contact) => {
      dispatch(
        addData({
          key: "target",
          data: {
            id: contact?.id,
            name: contact?.name,
            type: "direct",
            avatarSrc: contact?.avatarBuffer || contact?.avatarSrc,
            createdAt: contact?.createdAt?.toString(),
            updatedAt: contact?.updatedAt?.toString(),
          },
        })
      );
    },
    [dispatch]
  );

  const itemContent = useCallback(
    (index) => {
      const contact = filteredObjects[index];
      const next = filteredObjects[index + 1];
      const isDivisible =
        Boolean(next) &&
        next.name.charAt(0).toLowerCase() ===
          contact.name.charAt(0).toLowerCase();

      return (
        <div>
          <ContactItem
            {...contact}
            search={search}
            onClick={() => handleClickContact(contact)}
          />
          {isDivisible && <Divider variant='inset' component='div' />}
        </div>
      );
    },
    [search, filteredObjects, handleClickContact]
  );

  const groupContent = useCallback(
    (index) => {
      return (
        <ListSubheader
          sx={{
            fontWeight: "bold",
            height: 50,
            top: 0,
            position: "sticky",
            zIndex: 2,
            background: (theme) =>
              `linear-gradient(transparent 0%, ${theme.palette.background.paper} 100%)`,
            backdropFilter: (theme) => `blur(${theme.customOptions.blur})`,
          }}>
          {letters[index]}
        </ListSubheader>
      );
    },
    [letters]
  );

  return (
    <React.Fragment>
      <LoadingList loading={contacts === undefined} />
      <EmptyContentMessage
        title='Aucun contact trouvé'
        show={contacts?.length === 0 || filteredObjects.length === 0}
        description={`
                Pour une collaboration simplifiée et efficace,
                invitez ou recevez vos collaborateurs par e-mail et 
                améliorez votre productivité dès maintenant`}
      />
      {Boolean(filteredObjects?.length) && (
        <CustomListItemsGroup
          itemContent={itemContent}
          groupCounts={Object.values(countByLetter)}
          groupContent={groupContent}
        />
      )}
    </React.Fragment>
  );
};

function processObjects(objects = [], search = "") {
  const sortedObjects = objects
    .map((obj) => ({
      ...obj,
      name: `${obj.firstName} ${obj.middleName ? obj.middleName + " " : ""}${
        obj.lastName
      }`,
      email: obj.email.toLowerCase(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const searchRegExp = new RegExp(escapeRegExp(search), "i");
  const filteredObjects = sortedObjects.filter(
    (obj) =>
      searchRegExp.test(obj.firstName) ||
      searchRegExp.test(obj.lastName) ||
      (obj.middleName && searchRegExp.test(obj.middleName)) ||
      searchRegExp.test(obj.name) ||
      searchRegExp.test(obj.email)
  );

  const letters = filteredObjects.reduce((acc, obj) => {
    const firstLetter = obj.name.charAt(0).toUpperCase();
    if (!acc.includes(firstLetter)) {
      acc.push(firstLetter);
    }
    return acc;
  }, []);

  const countByLetter = letters.reduce((acc, letter) => {
    const count = filteredObjects.filter(
      (obj) => obj.name.charAt(0).toUpperCase() === letter
    ).length;
    acc[letter] = count;
    return acc;
  }, {});

  return { filteredObjects, letters, countByLetter };
}
