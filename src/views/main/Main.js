import { Box as MuiBox } from "@mui/material";
// import { useSelector } from "react-redux";
// import ChatBox from "./chat-box/ChatBox";
// import Home from "./home/Home";
import { drawerWidth } from "../navigation/Navigation";
import React from "react";
// import ActionWrapper from "./action/ActionWrapper";
// import ActionsWrapper from "./action/ActionsWrapper";
// import Forms from "./forms/Forms";

export default function Main() {
  return (
    <>
      <MuiBox
        component='main'
        overflow='hidden'
        height='100vh'
        sx={{
          flexGrow: 1,
          width: "100%",
          ml: {
            md: drawerWidth / 8,
            xs: 0,
          },
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}>
        {/* <ChatWrapper/> */}
      </MuiBox>
      {/* <Forms/>
            <ActionWrapper/>
            <ActionsWrapper/> */}
    </>
  );
}

// const ChatWrapper = () => {
//     const target = useSelector(store => store.data?.target);
//     return Boolean(target) ? <ChatBox /> : <Home/>;
// }
