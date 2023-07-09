import { CssBaseline, Box as MuiBox } from "@mui/material";
import React, { useEffect, useState } from "react";
import Main from "./main/Main";
import NavigationLeft from "./navigation/left/NavigationLeft";
import NavigationRight from "./navigation/right/NavigationRight";

export default function LiosoNaBudget () {

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
      <Main open={open}/>
      <NavigationRight
        open={open}
        contact={contact}
      />
    </React.Fragment>
  )
}