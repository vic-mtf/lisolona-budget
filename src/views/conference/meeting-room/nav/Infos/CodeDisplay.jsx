import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { alpha } from '@mui/material';

const CodeDisplay = () => {
  const code = useSelector((store) => store.conference.roomId);
  const characters = useMemo(() => code.slice(0, 9).split(''), [code]);

  return (
    <Box
      display="flex"
      gap={1}
      justifyContent="center"
      alignItems="center"
      my={3}
      sx={{
        userSelect: 'text!important',
      }}
    >
      {characters.map((char, index) => (
        <Box
          key={index}
          width={30}
          height={30}
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius={1}
          sx={(t) => ({
            fontWeight: 'bold',
            border: '1px solid ' + t.palette.divider,
            bgcolor: alpha(
              t.palette.common[t.palette.mode === 'dark' ? 'white' : 'black'],
              0.04
            ),
          })}
        >
          <Typography variant="h6">{char}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CodeDisplay;
