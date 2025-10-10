import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import pubs from './pubs';
import PropTypes from 'prop-types';
import { useState, useRef, useEffect, useCallback } from 'react';
import useSwipe from '../../../hooks/useSwipe';
import IconButton from '@mui/material/IconButton';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import { alpha, Stack } from '@mui/material';

export default function CarouselPub() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const handleTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((index) => (index + 1) % pubs.length);
    }, 5000);
  }, []);

  const { ref } = useSwipe({
    onSwipe: (_, direction) => {
      handleTimer();
      if (direction === 'left') setIndex((index) => (index + 1) % pubs.length);
      if (direction === 'right')
        setIndex((index) => (index === 0 ? pubs.length - 1 : index - 1));
    },
  });

  useEffect(() => {
    handleTimer();
    return () => clearInterval(intervalRef.current);
  }, [handleTimer]);

  return (
    <Box
      position="relative"
      draggable={false}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: '100%',
        overflow: 'hidden',
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          maxWidth: 600,
          maxHeight: 420,
          position: 'relative',
          '& > .MuiIconButton-root': {
            bgcolor: (t) => alpha(t.palette.common.black, 0.4),
            color: (t) => t.palette.common.white,
            opacity: 0,
            transition: (t) =>
              t.transitions.create('opacity', {
                easing: t.transitions.easing.easeInOut,
                duration: t.transitions.duration.leavingScreen,
              }),
          },
          '&:hover > .MuiIconButton-root': {
            opacity: 1,
          },
        }}
        ref={ref}
      >
        {pubs.map((item, i) => (
          <Fade
            key={i}
            in={index === i}
            appear={false}
            unmountOnExit
            timeout={1000}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <div>
              <Item {...item} />
            </div>
          </Fade>
        ))}
        <Stack
          spacing={1}
          direction="row"
          position="absolute"
          justifyContent="center"
          sx={{ bottom: 0, left: 0, right: 0 }}
        >
          {pubs.map((_, i) => (
            <div key={i}>
              <IconButton
                onClick={() => {
                  handleTimer();
                  setIndex(i);
                }}
                sx={{
                  width: 10,
                  height: 10,
                  p: 0,
                  m: 0,
                  borderRadius: 25,
                  bgcolor: (t) =>
                    alpha(
                      i === index
                        ? t.palette.common.black
                        : t.palette.common.white,
                      0.4
                    ),
                }}
              />
            </div>
          ))}
        </Stack>

        <IconButton
          onClick={() => {
            handleTimer();
            setIndex((index) => (index + 1) % pubs.length);
          }}
          sx={{
            position: 'absolute',
            transform: 'translateY(-50%)',
            right: 0,
            top: '50%',
          }}
        >
          <NavigateNextOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            handleTimer();
            setIndex((index) => (index === 0 ? pubs.length - 1 : index - 1));
          }}
          sx={{
            position: 'absolute',
            transform: 'translateY(-50%)',
            left: 0,
            top: '50%',
          }}
        >
          <NavigateBeforeOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

const Item = ({ desc, ...otherProps }) => {
  return (
    <Card
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'none',
        height: '100%',
        userSelect: 'none',
      }}
      elevation={0}
    >
      <Box
        loading="lazy"
        sx={{
          height: 300,
          maxWidth: 300,
          m: 2,
          '& > img': {
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            overflow: 'hidden',
            cursor: 'none',
          },
        }}
        component="img"
        draggable={false}
        desc={desc}
        {...otherProps}
      />
      <CardContent sx={{ maxWidth: 500, height: 100 }}>
        <Typography variant="body1">{desc}</Typography>
      </CardContent>
    </Card>
  );
};

Item.propTypes = {
  desc: PropTypes.string,
};
