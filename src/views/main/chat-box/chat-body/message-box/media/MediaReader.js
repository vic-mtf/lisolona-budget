import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import Multimedia from '../../../../multimedia/Multimedia';
import { useSelector } from 'react-redux';
import getMedias from '../../../../../../database/getMedias';


export default function MediaReader ({defaultValue, onClose}) {
    const [items, setItems] = useState([]);
    const open = useMemo(() => Boolean(defaultValue), [defaultValue]);
    const userId = useSelector(store => store.user.id);
    const defaultItemRef = useRef(0);
    const defaultItem = useMemo(() => 
        items.length > 0 ? items.findIndex(({id}) => id === defaultValue?.id) : null, 
        [items, defaultValue]
    );
    if(defaultItem !== null)
        defaultItemRef.current = defaultItem;

    useLayoutEffect(() => {
        const target = {
            id: defaultValue?.targetId,
        }
        if(defaultValue)
            getMedias({target, userId})
            .then(setItems);
    }, [defaultValue, userId]);

    return (
        <React.Fragment>
            <Multimedia
                defaultValue={defaultItem || defaultItemRef.current}
                items={items}
                open={open}
                onClose={onClose}
            />
        </React.Fragment>
    
    )
}