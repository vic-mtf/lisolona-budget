import { Box as MuiBox } from "@mui/material";
// import { useSelector } from "react-redux";
// import ChatBox from "./chat-box/ChatBox";
// import Home from "./home/Home";
import { drawerWidth } from "../navigation/Navigation";
import React from "react";
import MainContent from "../../../components/MainContent";
// import ActionWrapper from "./action/ActionWrapper";
// import ActionsWrapper from "./action/ActionsWrapper";
// import Forms from "./forms/Forms";

export default function Main() {
  return (
    <>
      <MainContent>
        {/* <Forms/>
            <ActionWrapper/>
            <ActionsWrapper/> */}
      </MainContent>
    </>
  );
}

// const ChatWrapper = () => {
//     const target = useSelector(store => store.data?.target);
//     return Boolean(target) ? <ChatBox /> : <Home/>;
// }
