import React, { useEffect, useMemo, useState } from 'react';
import { Divider } from '@mui/material';
import Slide from './Slide';
import Fade from './Fade';
import store from '../../../../../redux/store';

const AnimatedWrapper = React.memo (({children, path, type = 'slide', divided=true, defaultOpen, wrapperProps}) => {
    const [open, setOpen] = useState(defaultOpen || Boolean(getValue(store.getState(), path)));
    const WrapperComponent = useMemo(() => type?.toLowerCase() === 'slide' ? Slide : Fade, [type]);
  
    useEffect(() => {
      const unsubscribe = store.subscribe(() => {
        const state = getValue(store.getState(), path);
        if(!open && state) setOpen(true);
        if(open && !state) setOpen(false);
      });
      return () => {
        unsubscribe();
      };
    },[path, open]);
  
    return (
      <>
        <WrapperComponent 
          open={open}
          wrapperProps={wrapperProps}
        >
          {children}
        </WrapperComponent>
        {(open && divided) && <Divider/>}
      </>
    )
});

export const getValue = (obj, path="") => {
    const parts = path.split('.');
    let current = obj;
    for (let part of parts) {
        if (current[part] === undefined) return undefined;
        current = current[part];
    }
    return current;
};

export default AnimatedWrapper;