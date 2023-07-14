import {
    Box as MuiBox, useTheme
} from '@mui/material';
import Box from '../../../../components/Box';
import { useTransition, animated } from '@react-spring/web'

export default function BorderAnimate ({duration, visible}) {
    const theme = useTheme();
    const transitions = useTransition(visible ? [1] : [], {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
      })

    return transitions((style, item) => (
        <animated.div style={{...style}}>
            <MuiBox
                className="starbox"
                sx={{
                    position: 'absolute',
                    height: 'calc(100% - 20px)',
                    width: 'calc(100% - 20px)',
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    border: '10px solid',
                    borderRadius: 1,
                    bgcolor: 'transparent',
                    zIndex: -1,
                    '@property --gradX': {
                    syntax: `'<percentage>'`,
                    initialValue: '50%',
                    inherits: true,
                    },
                    '@property --gradY': {
                    syntax: `'<percentage>'`,
                    initialValue: '0%',
                    inherits: true,
                    },
                    borderImage: theme => `
                    conic-gradient(from var(--angle), 
                    ${theme.palette.primary.main + '0a'}, ${theme.palette.primary.main} 0.1turn, 
                    ${theme.palette.primary.main} 0.15turn, 
                    ${theme.palette.primary.main + '0a'} 0.25turn) 30`,
                    animation: `borderRotate ${duration}ms  linear infinite forwards`,
                    '& :nth-child(2)': {
                        borderImage: `radial-gradient(ellipse at var(--gradX) var(--gradY), ${theme.palette.primary.main}, ${theme.palette.primary.main} 10%, ${theme.palette.primary.main + '0a'} 40%) 30`,
                        animation: `borderRadial ${duration}ms  linear infinite forwards`,
                    },
                    '@keyframes borderRotate': {
                        '100% ': {
                            '--angle': '420deg',
                        }
                    },
                }}
            />
        </animated.div>
      ))

}
BorderAnimate.defaultProps = {
    duration: 4000,
    visible: true,
}