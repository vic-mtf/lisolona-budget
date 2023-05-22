import { Link, Box as MuiBox, Step, createTheme } from '@mui/material';
import Typography from '../../../../../../components/Typography';
import Button from '../../../../../../components/Button';
// import { useBorderRadius } from '../MessageBox';
import parse from 'html-react-parser';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const MAX_HEIGHT = 500;

export default function TextMessage ({
        content, 
        bgcolor, 
        borderRadius,
        isMine
    }) {
    const theme = createTheme({palette: {mode: 'light'}});
    const [moreStep, setMoreStep] = useState(1);
    const [showMore, setShowMore] = useState(false);
    const rootRef = useRef();
    const handleShowMore = useCallback(() => setMoreStep(step => step + 1), []);

    useLayoutEffect(() => {
        const rootHeight = parseInt(window.getComputedStyle(rootRef.current).height);
        const show = rootHeight >= MAX_HEIGHT * moreStep;
        if(show && !showMore) setShowMore(show);
        if(!show && showMore) setShowMore(show);
    },[showMore, moreStep]);

    return (
        <MuiBox display="flex" width="100%">
            <MuiBox display="flex" width="100%">
                <Typography
                    bgcolor={bgcolor}
                    width="100%"
                    borderRadius={borderRadius}
                    display="flex"
                    flexDirection="column"
                    color={isMine ? theme.palette.text.primary : 'inherit'}
                    maxHeight={MAX_HEIGHT * moreStep}
                    ref={rootRef}
                    position="relative"
                    textOverflow="ellipsis"
                >
                <MuiBox
                    component="div"
                    mx={2.5}
                    sx={{
                        overflowWrap: 'break-word',
                        wordWrap: 'break-word',
                        wordBreak: "break-word",
                        overflow: 'hidden',
                        ...showMore && {
                            "&:after": {
                                content: '""',
                                position: 'absolute',
                                bottom: '30px',
                                width: '100%',
                                height: 30,
                                background: theme => 
                                `linear-gradient(transparent, 10%, ${bgcolor})`,
                                boxSizing: 'inherit',
                            }
                        },
                        '& blockquote': {
                            marginLeft: '24px',
                            borderLeft: '4px solid #CCC',
                            paddingLeft: '6px',
                        },
                    }}
                >
                    {parse(content)}
                </MuiBox>
                <MuiBox  mx={2.5}>
                    {showMore &&
                    <Button
                        onClick={handleShowMore}
                        sx={{
                            position: 'relative',
                            top: '-2.5px'
                        }}
                    >voir plus...</Button>}
                </MuiBox>
                </Typography>
            </MuiBox>
        </MuiBox>
    )
}

TextMessage.defaultProps = {
    bgcolor: 'background.paper',
}