import React, { useCallback, useLayoutEffect, useRef } from "react";
import { 
    CircularProgress,
    Box as MuiBox
} from "@mui/material";
import DetailProfile from "./DetailPorfile";
import { MAX_OFFSET } from "./AutoScrollDown";
import { unionBy } from "lodash";

const RATIO = .0;

const ProgressiveScrollingContainer = ({
    onLoading, 
    children, 
    messages, 
    loadMore, 
    target,
    newMessages,
    setMessageGrouping,
    setNewMessages,
    rootRef: _rootRef
}) => {
    const rootRef = useRef();
    const sentinelRef = useRef();
    const scrollTopRef = useRef(0);
    const scrollHeight = useRef(0);
    const lastMessageIdRef = useRef(newMessages[0]?.id || messages[0]?.id);

    const globalRootRef = useCallback(node => {
      if(node) {
        rootRef.current = node;
        if(_rootRef) _rootRef.current ??= node;
      }
    },[_rootRef]);
  
    useLayoutEffect(() => {
      const options = {root: rootRef.current, rootMargin: '0px', threshold: RATIO};
      rootRef.current.scrollTop = scrollTopRef.current;
      const isAutoScrolling = Math.abs(rootRef.current.scrollTop) < MAX_OFFSET * 2;
      const [message] = messages || [];
      const id = message?.id;
      if(isAutoScrolling && id !== lastMessageIdRef.current) {
        const grap =  rootRef.current.scrollHeight - scrollHeight.current;
        rootRef.current.scrollTop = scrollHeight.current ? scrollTopRef.current - grap : 0;
        scrollHeight.current = 0;
        lastMessageIdRef.current = id;
      }
      const observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
           if(entry.intersectionRatio > RATIO){
            onLoading();
            observer.unobserve(entry.target);
           }
          })
        }, options);
        if(sentinelRef.current) observer.observe(sentinelRef.current);
        return () => {
          observer.disconnect();
        }
    },[onLoading, messages]);
  
    return (
      <MuiBox
        sx={{
          overflow: 'hidden',
          overflowY: "auto",
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
        width="100%"
        ref={globalRootRef}
        // p={2}
        component="div"
        onScroll={event => {
          const scrollTop = event.target.scrollTop;
          scrollTopRef.current = scrollTop;
          if(Math.abs(scrollTop) <= 15 && newMessages?.length) {
            setMessageGrouping(messageGrouping => {
              const [messages] = messageGrouping;
              messages.unshift(...newMessages);
              return messageGrouping.map(messages => unionBy(messages, 'id'));
            });
            setNewMessages([]);
            scrollHeight.current = event.target.scrollHeight
          }
        }}
      >
          <MuiBox
            // width="100%"
            mx={1}
            my={1}
            sx={{
              display: 'flex',
              flexDirection: 'column-reverse'
            }}
          >
            {children}
            {loadMore &&
            <MuiBox
              ref={sentinelRef}
              margin="auto"
            >
              <MuiBox
                children={
                  <CircularProgress
                    color="primary"
                    size={18}
                  />
                }
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={.5}
                mt={1}
                bgcolor="background.paper"
                borderRadius={10}
              />
            </MuiBox>}
          </MuiBox>
          <MuiBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={400}
            width="100%"
          >
              <DetailProfile target={target}/>
          </MuiBox>
      </MuiBox>
    )
  
  }

export default React.memo(ProgressiveScrollingContainer);