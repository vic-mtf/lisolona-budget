import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Box } from '@mui/material';

export default function Apptest() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
      }}
      //subheader={<li />}
    >
      {[0, 1, 2, 3, 4].map((sectionId) => (
        <div key={`section-${sectionId}`}>
            <ListSubheader component="div">{`I'm sticky ${sectionId}`}</ListSubheader>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13].map((item) => (
              <ListItem key={`item-${sectionId}-${item}`}>
                <ListItemText primary={`Item ${item}`} />
              </ListItem>
            ))}
        </div>
      ))}
    </Box>
  );
}