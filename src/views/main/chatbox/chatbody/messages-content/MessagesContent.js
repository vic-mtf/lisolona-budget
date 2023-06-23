import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { 
    Fade,
    Box as MuiBox
} from "@mui/material";
import AutoScrollDown, { MAX_OFFSET } from "./AutoScrollDown";
import MessageGroupBoxByDate from "./MessageGroupBoxByDate";
import { useSelector } from "react-redux";
import { useData } from "../../../../../utils/DataProvider";
import dbConfig from '../../../../../configs/database-config.json';
import MessageWorker from '../../../../../workers/messages/messages.worker';
import ProgressiveScrollingContainer from "./ProgressiveScrollingContainer";
import replaceObjects from '../../../../../utils/replaceObjects';
import partitionArray from '../../../../../utils/partitionArray';
import { unionBy } from "lodash";

const messageWorker = MessageWorker();

function MessageContent ({rootRef: _rootRef, target}) {
  const rootRef = useRef();
  const isScrollableRef = useRef(false);
  const userId = useSelector(store => store.user.id);
  ///const messageWorker = useMemo(() => new Worker(URL_WORKER), []);
  const [{messagesRef}] = useData();
  const subMessages = useMemo(() => {
    const data = messagesRef?.current[target?.id] || {
      messages: [],
      total: 0,
    };
    return {
      ...data,
      messages: data?.messages?.slice(0, 20)
    };
  }, 
  [messagesRef, target?.id]
  );
  const {total, messages: defaultMss} = useMemo(() => 
    ({total: 0, messages: [], ...subMessages || {}}),
    [subMessages]
  );
  const [messageGrouping, setMessageGrouping] = useState([defaultMss]);
  const [newMessages, setNewMessages] = useState([]);
  const messages = useMemo(() => messageGrouping.flat(), [messageGrouping]);

  const onViewNewMessages = useCallback(() => {
    setMessageGrouping(messageGrouping => {
      const [messages] = messageGrouping;
      messages.unshift(...newMessages);
      return messageGrouping.map(messages => unionBy(messages, 'id'));
    });
    setNewMessages([]);
  }, [newMessages]);

  const onloadMessages = useCallback (async () => {
    const data = {
      userId,
      dbConfig,
      offset: messages.length,
      target,
    };
    const update =  messagesRef?.current[target?.id]?.messages;
    const loadingMessages = await messageWorker.getMessages(data);
    setMessageGrouping(
      messageGrouping => {
        const updateMessages  = replaceObjects(
          update, 
          messageGrouping?.flat()
        );
        return partitionArray(updateMessages).concat(loadingMessages);
    });
  }, [userId, target, messages, messagesRef]);

  useLayoutEffect(() => {
    const nameMessageEvent = '_new-message';
    const nameScrollEvent = '_auto-scroll-down';
    const root = document.getElementById('root');
    const containerRoot = rootRef.current;
    const getNewMessage = event => {
      const { message, updated } = event.detail;
      const isNews = Math.abs(rootRef.current.scrollTop) > MAX_OFFSET;
      const isUpdatingOldMessage = Boolean(
        messageGrouping.flat()?.find(({id}) => id === message.id)
      );
      if(isNews && !isUpdatingOldMessage) 
      setNewMessages(messages => {
          const index = messages.findIndex(({id}) => id === message.id);
          if(index > -1 && updated) messages[index] = message;
          else messages.unshift(message);
          return unionBy(messages, 'id');
      });
      else setMessageGrouping(messageGrouping => {
            const [messages] = messageGrouping;
            const index = messages.findIndex(({id}) => id === message.id);
            if(index > -1 && updated) messages[index] = message;
            else messages.unshift(message);
            return messageGrouping.map(messages => unionBy(messages, 'id'));
      });
    };
    const setScrollable = () => isScrollableRef.current = true;
    root.addEventListener(nameMessageEvent, getNewMessage);
    containerRoot?.addEventListener(nameScrollEvent, setScrollable);
    return () => {
      root.removeEventListener(nameMessageEvent, getNewMessage);
      containerRoot?.removeEventListener(nameScrollEvent, setScrollable);
    };
  }, [messageGrouping, target?.id, messagesRef]);

  useLayoutEffect(() => {
    if(isScrollableRef.current && newMessages.length === 0) {
      rootRef.current.scrollTo({top: 0});
      isScrollableRef.current = false;
    }
  },[newMessages]);

  return (
    <React.Fragment>
      <Fade in>
        <MuiBox
            overflow="hidden"
            width="100%"
            height="100%"
            component="div"
            sx={{
              zIndex: 0,
              display: 'flex',
              flexDirection: 'column-reverse'
            }}
        > 
        <ProgressiveScrollingContainer
          onLoading={onloadMessages}
          loadMore={total > messages.length}
          messages={messages}
          rootRef={rootRef}
          target={target}
          newMessages={newMessages}
          setNewMessages={setNewMessages}
          setMessageGrouping={setMessageGrouping}
        >
          <MessageGroupBoxByDate
            messages={messages}
            loadMore={total > messages.length}
          />
        </ProgressiveScrollingContainer>
        </MuiBox>
      </Fade>
      <AutoScrollDown
          rootRef={rootRef}
          news={newMessages.length}
          onViewNewMessages={onViewNewMessages}
      />
    </React.Fragment>
  )
}

export default MessageContent;
