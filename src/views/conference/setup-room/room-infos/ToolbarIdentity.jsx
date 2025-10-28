import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import ListAvatar from '../../../../components/ListAvatar';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import getFullName from '../../../../utils/getFullName';

export const ToolbarIdentity = () => {
  const { state } = useLocation();
  const target = useMemo(() => state?.target || null, [state]);

  return (
    target && (
      <ListItem
        sx={{
          px: 2,
          position: 'sticky',
          top: 0,
          bgcolor: 'transparent',
          backdropFilter: 'blur(15px)',
          zIndex: (t) => t.zIndex.appBar,
        }}
        disableGutters
        disablePadding
      >
        <ListItemAvatar>
          <ListAvatar id={target?.id} src={target?.image} />
        </ListItemAvatar>
        <ListItemText
          primary={getFullName(target)}
          secondary={target?.email || target?.description || ''}
          slotProps={{
            primary: {
              textOverflow: 'ellipsis',
              width: '100%',
              overflow: 'hidden',
              noWrap: true,
            },
            secondary: {
              textOverflow: 'ellipsis',
              width: '100%',
              overflow: 'hidden',
              noWrap: true,
              title: target?.email || target?.description || '',
            },
          }}
        />
      </ListItem>
    )
  );
};

export default ToolbarIdentity;
