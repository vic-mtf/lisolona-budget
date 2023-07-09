import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

export default function CircularProgressWithLabel(props) {
  return (
    <Box sx={{
        position: 'relative', 
        display: 'inline-flex',
      }}
    >
      <Box sx={{ 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <CircularProgress
          variant="determinate"
          sx={{
            color: (theme) =>
              theme.palette.grey[theme.palette.mode === 'light' ? 'A100' : 'A700'],
          }}
          thickness={4}
          value={100}
        />
        <CircularProgress
          //variant="determinate"
          //disableShrink
          sx={{
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
          }}
          thickness={4}
          {...props}
        />
      </Box>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};
