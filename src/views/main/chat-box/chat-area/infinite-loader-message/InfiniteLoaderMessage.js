import { Virtuoso } from "react-virtuoso";
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Fade, Box as MuiBox } from "@mui/material";
import ScrollDownButton from "./ScrollDownButton";
import MessageContainer from "../message/MessageContainer";
import { MESSAGE_CHANNEL } from "../../ChatBox";

const INITIAL_ITEM_COUNT = 20;
const styleRoot = {
  height: "100%",
  width: "100%",
  position: "relative",
  display: "flex",
};

export default function InfiniteLoaderMessage({
  INITIAL_ITEM_COUNT = INITIAL_ITEM_COUNT,
  data: _data = [],
  target,
  small,
}) {
  const [data, setData] = useState(
    [
      {
        variant: "alert",
        type: "profile",
      },
      _data,
    ].flat()
  );
  const virtuosoRef = useRef();
  const scrollerRef = useRef();
  const START_INDEX_REF = useRef(data?.length || 0);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_ITEM_COUNT);
  const firstItemIndex = useMemo(
    () => START_INDEX_REF.current + INITIAL_ITEM_COUNT - currentIndex,
    [currentIndex, INITIAL_ITEM_COUNT]
  );
  const messages = useMemo(
    () => data?.slice(-currentIndex) || [],
    [currentIndex, data]
  );

  const prependItems = useCallback(() => {
    const nextFirstItemIndex = firstItemIndex - INITIAL_ITEM_COUNT;
    if (nextFirstItemIndex > 0)
      setCurrentIndex((index) => index + INITIAL_ITEM_COUNT);
    return false;
  }, [firstItemIndex, INITIAL_ITEM_COUNT]);

  useEffect(() => {
    const name = "_new-message";
    const handleGetNewMessage = (event) => {
      const data = [{ variant: "alert", type: "profile" }, ..._data];
      setData(data);
    };
    MESSAGE_CHANNEL.addEventListener(name, handleGetNewMessage);
    return () => {
      MESSAGE_CHANNEL.removeEventListener(name, handleGetNewMessage);
    };
  }, [_data]);

  return (
    <Fade in style={styleRoot}>
      <MuiBox
        sx={{
          ...styleRoot,
          flexDirection: "column",
          overflow: "hidden",
        }}>
        <Virtuoso
          style={{
            height: "100%",
            display: "flex",
          }}
          ref={virtuosoRef}
          scrollerRef={(ref) => (scrollerRef.current = ref)}
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={data?.length}
          totalCount={data?.length}
          data={messages}
          itemsRendered={() => true}
          startReached={prependItems}
          defaultItemHeight={80}
          followOutput='auto'
          itemContent={(index, message) => {
            return (
              <MessageContainer
                message={message}
                messages={data}
                index={index}
                small={small}
                target={target}
              />
            );
          }}
        />
        <ScrollDownButton
          scrollerRef={scrollerRef}
          virtuosoRef={virtuosoRef}
          data={data}
        />
      </MuiBox>
    </Fade>
  );
}
