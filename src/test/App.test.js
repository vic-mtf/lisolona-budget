import * as React from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined';

const wave = keyframes`
  0% { transform: rotate( 0.0deg) }
 10% { transform: rotate(14.0deg) } 
 20% { transform: rotate(-8.0deg) }
 30% { transform: rotate(14.0deg) }
 40% { transform: rotate(-4.0deg) }
 50% { transform: rotate(10.0deg) }
 60% { transform: rotate( 0.0deg) } 
100% { transform: rotate( 0.0deg) }
`;

const WavingHandAnimate = styled((props) => (
  <WavingHandOutlinedIcon {...props}>
  </WavingHandOutlinedIcon>
))`
animation-name: ${wave};
animation-duration: ${(props) => props.duration || '2s'};
animation-timing-function: linear;
animation-delay: ${(props) => props.delay || '0s'};
animation-direction: alternate;
animation-fill-mode: forwards;
animation-play-state: running;
`;

export default  WavingHandAnimate;
