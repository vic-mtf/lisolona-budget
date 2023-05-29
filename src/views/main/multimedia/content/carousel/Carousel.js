import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Container, ContainerInner, ContainerNavigationZone, ContainerlItem, NavigationButton } from "./components";
import { Fab, Fade, duration } from "@mui/material";
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

export default function Carousel ({children, autoPlay, value, onChange}) {
    const containerInnerRootRef = useRef();
    const previousValueRef = useRef(0);
    const handleToggleItemTo = useCallback(direction => {
        if (direction === 'left') 
            onChange(Math.max(0, value - 1));
        if (direction === 'right') 
            onChange(Math.min(items.length, value + 1))
    }, [onChange]);
    const animated = useMemo(() => Math.abs(value - previousValueRef.current) <= 1  , [value])
    const items = React.Children.map(children, (child, index) => 
        <ContainerlItem 
            key={`${index}`}
        >{React.cloneElement(
            child, 
            {
                index, 
                selected: index === value, 
                containerInnerRootRef,
                handleToggleItemTo

            })}
        </ContainerlItem>
    );

    useEffect(() => {
        previousValueRef.current = value;
    }, [value]);

    return (
        <Container>
            <ContainerInner
                sx={{
                    transform: `translateX(-${value * 100}%)`,
                   ...animated ? {} : {transitionDuration: '1ms'}
                }}
                ref={containerInnerRootRef}
                autoFocus
            >
                {items}
            </ContainerInner>
            <Navigation 
                left={0} 
                show={Boolean(value)}
                onClick={() => handleToggleItemTo('left')}
            >
                <NavigateBeforeRoundedIcon />
            </Navigation>
            <Navigation 
                right={0} 
                show={items.length - 1 !== value}
                onClick={() => handleToggleItemTo('right')}
            >
                <NavigateNextRoundedIcon />
            </Navigation>
        </Container>
    );
}

const Navigation = ({children, show, onClick, ...otherProps}) => {
    const [enter, setEnter] = useState(false);

    return (
        <ContainerNavigationZone 
            {...otherProps}
            onMouseEnter={() => setEnter(true)}
            onMouseLeave={() => setEnter(false)}
        >
            <Fade in={show && enter}>
                <NavigationButton
                    onClick={onClick}
                >
                    {children}
                </NavigationButton>
            </Fade>
        </ContainerNavigationZone>
    )
}

