import { CssBaseline, Box as MuiBox } from '@mui/material';
import React, { useMemo } from 'react';
import Main from './main/Main';
import NavigationLeft from './navigation/left/NavigationLeft';
import NavigationRight from './navigation/right/NavigationRight';
import { useSelector } from 'react-redux';

export default function LiosoNaBudget () {

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
  const detail = useSelector(store => store.data.target?.showDetails);
  const open = useMemo(() => Boolean(detail), [detail]);

  return (
    <React.Fragment>
      <Main open={open}/>
      <NavigationRight
        open={open}
      />
    </React.Fragment>
  )
}