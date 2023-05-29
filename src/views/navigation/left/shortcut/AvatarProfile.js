import React from "react";
import { useSelector } from "react-redux";
import Avatar from "../../../../components/Avatar";
import CustomBadge from "../../../../components/CustomBadge";
import useOnLine from "../../../../utils/useOnLine";

export default function AvatarProfile () {
    const { name, avatarSrc } = useSelector(store => {
        const { lastname, firsname, image: avatarSrc } = store.user;
        const name = `${lastname || ''} ${firsname || ''}`.trim();
        return ({name, avatarSrc});
    })
    const isOnLine = useOnLine();
    
    return (
        <React.Fragment>
            <CustomBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={isOnLine}
            >  
                <Avatar 
                    alt={name} 
                    src={avatarSrc} 
                    srcSet={avatarSrc}
                    children={name?.charAt(0)}
                />
            </CustomBadge>
        </React.Fragment>
    );
}