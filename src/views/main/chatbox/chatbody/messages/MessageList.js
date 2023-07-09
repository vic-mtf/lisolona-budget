import React, { useRef } from 'react';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized';
import MessageItem from './MessageItem';
import { Box as MuiBox } from '@mui/material';

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 100,
});

const MessageList = ({ messages, onScroll }) => {
  
  const rowRenderer = ({ index, key, parent, style }) => {
    const message = messages[index];
    const cellMeasurerRef = React.createRef();

    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        ref={cellMeasurerRef}
        rowIndex={index}
      >
        <div style={style}>
          <MessageItem message={message} />
          {/* {message.content} */}
        </div>
      </CellMeasurer>
    );
  }

  const handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    const isAtBottom = clientHeight + scrollTop >= scrollHeight;
    onScroll(isAtBottom);
  };

  const rowCount = 1000;
  const loadMoreRows = ({ startIndex, stopIndex }) => {
    // Charger les données pour les index spécifiés
  };

  const isRowLoaded = ({ index }) => {
    // Vérifier si les données pour l'index spécifié ont été chargées
  };

  return (
    <InfiniteLoader
      rowCount={rowCount}
      loadMoreRows={loadMoreRows}
      isRowLoaded={isRowLoaded}
    >
      {({onRowsRendered, registerChild}) => (
        <AutoSizer>
          {({height, width}) => (
            <List
              //onRowsRendered={(e, r) => console.log(e)}
              width={width}
              height={height}
              rowCount={messages.length}
              rowHeight={cache.rowHeight}
              rowRenderer={rowRenderer}
              onScroll={handleScroll}
              variableRowHeight
              scrollToAlignment="end"
              scrollToIndex={messages.length - 1}
            />
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
};

export default MessageList;
