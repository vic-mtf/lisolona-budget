import { VirtuosoGrid } from 'react-virtuoso'
import { styled, Box as  MuiBox, Avatar, Skeleton, Backdrop} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, animate, AnimatePresence } from 'framer-motion';

const screenHeightDivider = (screen, len) => {
  if(len === 1) return 1
  if(screen === 'xs') {
    if(len === 3) return 1 / 3;
    else return .5
  };

  if(screen === "sm") {
    if(len === 3) return 1 / 3;
    else if( len < 5 ) return .5
    else return 1 / 3
  }

  if(screen === "md") {
    if(len === 2) return 1;
    else if(len < 7) return .5;
    else return 1 / 3;
  }

  if(screen === "lg") {
    if(len === 2) return 1;
    else if(len < 7) return .5;
    else return 1 / 3;
    //else return 1 / 4;
  }

  if(screen === "xl") {
    if(len === 2) return 1;
    else if(len < 7) return .5;
    else if(len < 15) return 1 / 3;
    else if(len < 20) return 1 / 4;
    else return 1 / 5;
  }
}

const screenWidthDivider = (screen, len) => {
  if(len === 1) return 1
  if(screen === 'xs') {
    if(len < 4) return 1;
    else return .5;
  }

  if(screen === "sm") {
    if(len < 4) return 1;
    else return .5;
  }

  if(screen === "md") {
    if(len  < 5) return .5;
    else return 1 / 3;
  }

  if(screen === "lg") {
    if(len  < 5) return .5;
    else if(len < 10) return 1 / 3;
    else return 1 / 4;
  }

  if(screen === "xl") {
    if(len  < 5) return .5;
    else if(len < 10) return 1 / 3;
    else if(len < 15) return 1 / 4;
    else return 1 / 5;
  }
}

const handleClick = (event, itemToZoom) => {
  event.stopPropagation();
  
  animate(itemToZoom, {
    zIndex: 2,
    scale: 1.5,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  });
}

const ItemContainer = styled(({len, rootHeight, ...otherProps}) => {
  const margin = 10;
  return (
    <MuiBox
      {...otherProps}
      sx={{
        flex: 1,
        width: {
          xs: `calc(${100 * screenWidthDivider('xs', len)}% - ${margin}px)`,
          sm: `calc(${100 * screenWidthDivider('sm', len)}% - ${margin}px)`,
          md: `calc(${100 * screenWidthDivider('md', len)}% - ${margin}px)`,
          lg: `calc(${100 * screenWidthDivider('lg', len)}% - ${margin}px)`,
          xl: `calc(${100 * screenWidthDivider('xl', len)}% - ${margin}px)`,
        },
        height: {
          xs: (rootHeight * screenHeightDivider('xs', len)) - margin,
          sm: (rootHeight * screenHeightDivider('sm', len)) - margin,
          md: (rootHeight * screenHeightDivider('md', len)) - margin,
          lg: (rootHeight * screenHeightDivider('lg', len)) - margin,
          xl: (rootHeight * screenHeightDivider('xl', len)) - margin
        }
      }}
    />
  );
})(() => ({
    display: 'flex',
    flex: 'none',
    alignContent: 'stretch',
    boxSizing: 'border-box',
    position: 'relative',
    border: '1px solid black'
}));

const ListContainer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  margin: 'auto auto',
  width: '100%',
  gap: '5px',
  "& > *" : {
    marginBottom: 0,
  }
}));

export default function GridDataDisplay ({data, pinIndex}) {
  const rootRef = useRef();
  const [rootHeight, setRootHeight] = useState(0);
  const len = useMemo(() => data?.length, [data]);

  useEffect(() => {
    let handleCalcRootSize;
    (handleCalcRootSize = () => {
      if(rootRef.current) {
        const height = parseFloat( 
          window.getComputedStyle(rootRef.current).height
        );
        if(height !== rootHeight)
          setRootHeight(height);
      }
    })();
    window.addEventListener('resize', handleCalcRootSize);
    return () => {
      window.removeEventListener('resize', handleCalcRootSize);
    };
  }, [rootHeight]);

  return (
  <MuiBox
    display="flex"
    height="100%"
    width="100%"
    overflow="hidden"
    position="relative"
    ref={rootRef}
  >
    <VirtuosoGrid
      style={{ 
        width: '100%',
        // display: 'flex',
      }}
      totalCount={len}
      overscan={24}
      components={{
        Item: props => {
        return (
          <ItemContainer 
            rootHeight={rootHeight} 
            transition={{ duration: 0.5 }}
            {...props} 
            len={len}
            />
          )
      },
        List: ListContainer,
        ScrollSeekPlaceholder: ({ height, width, index }) => (
          <ItemContainer
            rootHeight={rootHeight}
            len={len}
          >
            <Avatar
              sx={{
                height: '100%',
                width: "100%",
                opacity: .8,
              }}
              variant="square"
            />
            <Skeleton
              sx={{
                position: 'absolute',
                height: '100%',
                width: "100%",
                zIndex: -1,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </ItemContainer>
        ),
      }}
      itemContent={index => 
      <motion.div
        component={motion.div}
        layoutId={index}
        style={{
          width: "100%",
          height: "100%",
        }}
      >{data[index]}</motion.div>}
      scrollSeekConfiguration={{
        enter: velocity => Math.abs(velocity) > 200,
        exit: velocity => Math.abs(velocity) < 30,
        change: (_, range) => null
      }}
    />
    <>
      <AnimatePresence>
        {typeof pinIndex === 'number' && (
          <motion.div 
            layoutId={pinIndex} 
            style={{
              position: 'relative',
              overflow: 'hidden',

            }}
          >
            <Backdrop
              open
              sx={{
                zIndex: (theme) => theme.zIndex.modal - 1,
                height: rootHeight,
              }}
            >
              <ItemContainer len={1} rootHeight={rootHeight}>
                {data[pinIndex]}
              </ItemContainer>
            </Backdrop>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  </MuiBox>
  )
}

GridDataDisplay.defaultProps = {
  data: []
};