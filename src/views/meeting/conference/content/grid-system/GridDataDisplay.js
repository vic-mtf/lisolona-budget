import { VirtuosoGrid } from 'react-virtuoso'
import { Box as  MuiBox, Avatar, Skeleton} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import ItemContainer, { ListContainer } from './ItemContainer';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Present from './Present';

export default function GridDataDisplay ({data}) {
  const rootRef = useRef();
  const [rootHeight, setRootHeight] = useState(0);
  const len = useMemo(() => data?.length, [data]);

  useEffect(() => {
    let handleCalcRootSize;
    (handleCalcRootSize = () => {
        const height = parseFloat( 
          window.getComputedStyle(rootRef.current).height
        );
        if(height !== rootHeight)
          setRootHeight(height);
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
      <PresentFrame>
        <MuiBox
          display="flex"
          height="100%"
          width="100%"
          overflow="hidden"
          position="relative"
          pt={1}
        >
          <VirtuosoGrid
            style={{width: '100%'}}
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
              ScrollSeekPlaceholder: ({height, width, index }) => (
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
            <div
              style={{
                width: "100%",
                height: "100%",
              }}
            >
                {data[index]}
            </div>}
            scrollSeekConfiguration={{
              enter: velocity => Math.abs(velocity) > 200,
              exit: velocity => Math.abs(velocity) < 30,
              change: (_, range) => null // console.log({ range }),
            }}
          />
        </MuiBox>
      </PresentFrame>
    </MuiBox>
  );
}

const PresentFrame = ({children}) => {
  const pinId = useSelector(store => store.conference.pinId);

  const variants = {
    open: { opacity: 1, scale: 1 },
    closed: { opacity: 0, scale: 0.5 },
  };

  return (
    <AnimatePresence initial={false}>
     
      {!pinId && 
      <motion.div
        variants={variants}
        initial="closed"
        animate="open"
        exit="closed"
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        transition={{ duration: 0.5 }}
      >{children}</motion.div>}
      {!!pinId && 
      <motion.div
        variants={variants}
        initial="closed"
        animate="open"
        exit="closed"
        transition={{ duration: 0.5 }}
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >{<Present id={pinId}/>}</motion.div>}
    </AnimatePresence>
  )
};
GridDataDisplay.defaultProps = {
  data: []
};