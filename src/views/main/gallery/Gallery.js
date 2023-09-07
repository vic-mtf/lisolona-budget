import { Modal, Stack, Divider } from '@mui/material';
import GalleryHeader from './header/GalleryHeader';
import GalleryContent from './content/GalleryContent';
import GalleryFooter from './footer/GalleryFooter';
import { useRef, useState } from 'react';

export default function Gallery (/*{items, index, setDefaultItem}*/) {
    const items = new Array(50).fill(null);
    const setDefaultItem = null;
    const index = 0;
    return (
        <Modal 
            open={false}
            BackdropProps={{
                sx: {
                    bgcolor: theme => theme.palette.background.paper +
                    theme.customOptions.opacity,
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                }
            }}
            sx={{
                display: 'flex',
            }}
        >
            <GalleryData
                items={items}
                defaultIndex={index}
                setDefaultItem={setDefaultItem}
            />
        </Modal>
    );
}

function GalleryData ({items, defaultIndex, setDefaultItem}) {
    const [selectedItem, setSelectedItem] = useState(
        typeof defaultIndex === 'number' ? items[defaultIndex] :
        typeof setDefaultItem === 'function' ? setDefaultItem(items) : items[0]
    );
    const oldSelectedItemRef = useRef();
    const handleSelect = item => {
        oldSelectedItemRef.current = selectedItem;
        setSelectedItem(item);
    };

    return (
        <Stack
            divider={<Divider/>}
            display="flex"
            flex={1}
            
        >
            <GalleryHeader data={selectedItem}/>
            <GalleryContent
                selectedItem={selectedItem}
                oldSelectedItemRef={oldSelectedItemRef}
                onSelect={handleSelect}
                items={items}
            />
            <GalleryFooter
                data={selectedItem}
                oldSelectedItemRef={oldSelectedItemRef}
                onSelect={handleSelect}
                items={items}
            />
        </Stack>
    )

}