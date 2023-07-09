import React from 'react';
import { FixedSizeGrid } from 'react-window';

const videoData = [
  { id: 1, url: 'https://example.com/video1.mp4', ratio: 1.5 },
  { id: 2, url: 'https://example.com/video2.mp4', ratio: 1.5 },
  { id: 3, url: 'https://example.com/video3.mp4', ratio: 1.5 },
  { id: 4, url: 'https://example.com/video4.mp4', ratio: 1.5 },
  { id: 5, url: 'https://example.com/video5.mp4', ratio: 1.5 },
  { id: 6, url: 'https://example.com/video6.mp4', ratio: 1.5 },
  { id: 7, url: 'https://example.com/video7.mp4', ratio: 1.5 },
  { id: 8, url: 'https://example.com/video8.mp4', ratio: 1.5 },
  { id: 9, url: 'https://example.com/video9.mp4', ratio: 1.5 },
  { id: 10, url: 'https://example.com/video10.mp4', ratio: 1.5 },
  { id: 11, url: 'https://example.com/video11.mp4', ratio: 1.5 },
  { id: 12, url: 'https://example.com/video12.mp4', ratio: 1.5 },
];

const getColumnCount = (width, len) => {
  const xs = width < 600;
  const sm = width < 960;
  const md = width < 1280;
  const lg = width < 1920;

  if(len === 1) return 1;
  if(len === 2) {
    if(xs || sm) return 1;
    return 2
  }
  if(len === 3) return

  if (width < 600) return 1;
  if (width < 960) return 2;
  if (width < 1280) return 3;
  if (width < 1920) return 4;
  return 5;
};

const GridFrameSyststem = () => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columnCount = getColumnCount(windowWidth);

  const itemData = {
    videos: videoData,
    columnCount,
    columnWidth: windowWidth / columnCount,
    rowHeight: windowWidth / columnCount / videoData[0].ratio,
  };

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const video = itemData.videos[index];

    if (!video) return null;

    return (
      <div style={style}>
        <div 
          src={video.url}  
          width="100%" 
          height="100%"
          style={{
            background: 'gray'
          }}
          children={index}
         />
      </div>
    );
  };

  return (
    <FixedSizeGrid
      columnCount={columnCount}
      columnWidth={itemData.columnWidth}
      rowCount={Math.ceil(videoData.length / columnCount)}
      rowHeight={itemData.rowHeight}
      height={window.innerHeight}
      width={window.innerWidth}
    >
      {Cell}
    </FixedSizeGrid>
  );
};

export default GridFrameSyststem;
