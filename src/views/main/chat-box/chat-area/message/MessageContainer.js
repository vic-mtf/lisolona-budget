import React, { useLayoutEffect, useRef, useState } from "react";
import useGrouped from "../infinite-loader-message/useGrouped";
import Alert from "../alert/Alert";
import Message from "./Message";

export default  React.memo(function MessageContainer ({index, message, messages, target, small, ...otherProps}) {
   const group = useGrouped(message, messages)

    return (
      <div 
        {...otherProps}
      >
       {message?.variant === "alert" &&
        <Alert {...message} target={target}/>
       } 
        {message?.variant === undefined &&
        <Message
          data={message}
          group={group}
          small={small}
        />} 
      </div>
    );
  });