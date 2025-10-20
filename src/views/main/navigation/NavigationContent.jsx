import { Fade, Box } from '@mui/material';
import tabs from './tabs';
import useNavTab from '../../../hooks/useNavTab';
import { createElement } from 'react';

export default function NavigationContent() {
  const [{ navTabValue }] = useNavTab();

  return tabs.map(({ id, component }) => (
    <Fade
      key={id}
      in={navTabValue === id}
      appear={false}
      style={{ zIndex: navTabValue === id ? 1 : -1 }}
    >
      <Box display="flex" flex={1} overflow="hidden" flexDirection="column">
        {createElement(component)}
      </Box>
    </Fade>
  ));
}
