import { CssBaseline, Box as MuiBox } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../redux/data";
import { useSocket } from "../utils/SocketIOProvider";
import Main from "./main/Main";
import NavigationLeft from "./navigation/left/NavigationLeft";
import NavigationRight from "./navigation/right/NavigationRight";
import Teleconference from "./teleconference/Teleconference";

export default function Archives () {
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('contacts', ({contacts}) => {
        const data = contacts?.map(contact => {
            const name = `${contact.fname} ${contact.lname} ${contact.mname}`.trim()
            return {
                origin: contact,
                name,
                email: contact?.email,
                id: contact?._id,
                avatarSrc: contact?.imageUrl,
            };
        });
        dispatch(addData({key: 'contacts', data}));
    });
    socket?.emit('contacts');
},[socket, dispatch]);

    return (
      <MuiBox
        display="flex"
        flex={1}
        width="100%"
        flexDirection="column"
        position="relative"
        overflow="hidden"
      >
        <MuiBox sx={{ display: 'flex', flex: 1, width: "100%"}}>
          <CssBaseline />
            <NavigationLeft/>
            <MainRight/>
        </MuiBox>
        <Teleconference/>
      </MuiBox>
    )
}

const MainRight = () => {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState();
  useEffect(() => {
    const root = document.getElementById('root');
    const handleOpenContact = event =>  {
      const  state = event.detail?.state;
      const contact = event.detail?.contact;
      setOpen(state === undefined ? !open : state);
      if(contact)
        setContact(contact);
    };
    root.addEventListener(
      '_user-infos',
      handleOpenContact
    );

    return () =>  {
      root.removeEventListener('_user-infos',
      handleOpenContact);
    };
  },[open, contact]);

  return (
    <React.Fragment>
      <Main
        open={open}
      />
      <NavigationRight
        open={open}
        contact={contact}
      />
    </React.Fragment>
  )
}