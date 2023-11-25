import { Virtuoso } from 'react-virtuoso';
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Fade, Box as MuiBox } from '@mui/material';
import ScrollDownButton from './ScrollDownButton';
import Message from '../message/Message';
import useDirection from './useDirection';

const INITIAL_ITEM_COUNT = 20;
const styleRoot = {
  height: '100%',
  width: '100%',
  position: 'relative',
  display: 'flex',
};

export default function InfiniteLoaderMessage({INITIAL_ITEM_COUNT, data: _data}) {
  const [data, setData] = useState(_data);
  const virtuosoRef = useRef();
  const scrollerRef = useRef();
  const START_INDEX_REF = useRef(data?.length || 0);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_ITEM_COUNT);
  const firstItemIndex = useMemo(() => 
    START_INDEX_REF.current + INITIAL_ITEM_COUNT - currentIndex, 
    [currentIndex, INITIAL_ITEM_COUNT]
  );
  const messages = useMemo(() => data?.slice(-currentIndex) || [], [currentIndex, data]);
  
  const prependItems = useCallback(() => {
    const nextFirstItemIndex = firstItemIndex - INITIAL_ITEM_COUNT
    if(nextFirstItemIndex > 0)
      setCurrentIndex(index => index + INITIAL_ITEM_COUNT);
    return false;
  }, [firstItemIndex, INITIAL_ITEM_COUNT]);
  
  
  return (
    <Fade 
      in
      style={styleRoot}
    >
      <MuiBox
        sx={{
          ...styleRoot,
          flexDirection: 'column',
          overflow: 'hidden',
          "& ._Virtuoso > div" : {
            display: 'flex',
            flexDirection: 'column',
            // px: .5, 
            // overflow: 'hidden',
            // justifyContent: 'end'
          }
        }}
      >
          <Virtuoso
              style={{ 
                  height: '100%', 
                  display: 'flex',
              }}
              ref={virtuosoRef}
              className='_Virtuoso'
              scrollerRef={ref => scrollerRef.current = ref}
              firstItemIndex={firstItemIndex}
              initialTopMostItemIndex={data?.length - 1 || 0}
              totalCount={data?.length}
              data={messages}
              startReached={prependItems}
              itemContent={(index, message) => {
                
                return (
                  <MessageContainer 
                    message={message}
                    messages={data}
                    index={index}
                  />
                )
              }}
            />
          <ScrollDownButton
            scrollerRef={scrollerRef}
            virtuosoRef={virtuosoRef}
          />
      </MuiBox>
    </Fade>
  )
}

const MessageContainer = React.memo(({index, message, messages}) => {

  const directions = useDirection(message, messages);

  return (

    <div
      style={{
        background: index % 2 ? 'black' : '#333',
      }}
    >
      <Message
        data={message}
        directions={directions}
      /> 
    </div>
  );
});

InfiniteLoaderMessage.defaultProps = {
  INITIAL_ITEM_COUNT,
  data: [],
};