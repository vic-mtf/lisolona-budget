import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useParams } from 'react-router-dom';
import { useMemo, useState, useRef } from 'react';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import createCallLink from '../../../../../utils/createCallLink';

const MeetingLink = () => {
  const { code } = useParams();
  const callUrl = useMemo(() => {
    if (!code) return null;
    return createCallLink(code);
  }, [code]);

  return (
    <Box>
      <List
        subheader={
          <ListSubheader
            sx={{
              fontWeight: 'bold',
              // borderTop: (t) => `1px solid ${t.palette.divider}`,
              // borderBottom: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            Lien de la réunion
          </ListSubheader>
        }
      >
        <ListItem>
          <ListItemText
            primary={callUrl}
            slotProps={{ primary: { noWrap: true, variant: 'body2' } }}
          />
          <div>
            <ShareOrCopyButton url={callUrl} />
          </div>
        </ListItem>
      </List>
    </Box>
  );
};

const ShareOrCopyButton = ({ url }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const handleShareOrCopy = async (e) => {
    e.preventDefault();
    if (window.navigator?.share) navigator.share({ url });
    else {
      clearTimeout(timer.current);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      timer.current = setTimeout(() => setCopied(false), 1000);
    }
  };
  return (
    <IconButton onClick={handleShareOrCopy} size="small" edge="end">
      {window.navigator?.share ? (
        <ShareOutlinedIcon fontSize="small" />
      ) : (
        <>
          {copied ? (
            <CheckOutlinedIcon fontSize="small" />
          ) : (
            <ContentCopyOutlinedIcon fontSize="small" />
          )}
        </>
      )}
    </IconButton>
  );
};

export default MeetingLink;
