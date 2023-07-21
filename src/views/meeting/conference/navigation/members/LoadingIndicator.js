import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

const StyledSkeleton = styled(Skeleton)(({ theme }) => ({
  '&:nth-of-type(1)': {
    animationDelay: `${theme.transitions.duration.standard}ms`,
  },
  '&:nth-of-type(2)': {
    animationDelay: `${theme.transitions.duration.standard * 2}ms`,
  },
  '&:nth-of-type(3)': {
    animationDelay: `${theme.transitions.duration.standard * 3}ms`,
  },
}));

export default function LoadingIndicator({size}) {
  return (
    <Stack
      direction="row"
      spacing={.25}
    >
      <StyledSkeleton variant="circular" width={size} height={size} animation="wave" />
      <StyledSkeleton variant="circular" width={size} height={size} animation="wave" />
      <StyledSkeleton variant="circular" width={size} height={size} animation="wave" />
    </Stack>
  );
}

LoadingIndicator.defaultProps = {
  size: 8,
}