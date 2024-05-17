import { CssBaseline, Box as MuiBox } from '@mui/material';
import React, { useMemo } from 'react';
import Main from './main/Main';
import NavigationLeft from './navigation/left/NavigationLeft';
// import NavigationRight from './navigation/right/NavigationRight';
import { useSelector } from 'react-redux';

export default function Views () {

    return (
      <MuiBox
        display="flex"
        flex={1}
        width="100%"
        flexDirection="column"
        position="relative"
        overflow="hidden"
      >
        <MuiBox sx={{ display: 'flex', flex: 1, width: "100%"}}>
          <CssBaseline />
          <NavigationLeft/>
          <MainRight/>
        </MuiBox>
      </MuiBox>
    )
}

const MainRight = () => {
  // const key = useSelector(store => store.data?.target?.id);
  const showDetail = useSelector(store => store.data?.target?.showDetail);
  const open = useMemo(() => Boolean(showDetail),[showDetail]);

  return (
    <React.Fragment>
      <Main open={open}/>
      {/* <NavigationRight
        open={open}
        key={key}
      /> */}
    </React.Fragment>
  )
}