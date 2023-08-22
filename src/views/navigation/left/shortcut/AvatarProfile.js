import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Avatar from "../../../../components/Avatar";
import CustomBadge from "../../../../components/CustomBadge";
import useOnLine from "../../../../utils/useOnLine";
import getFullName from "../../../../utils/getFullName";
import getShort from "../../../../utils/getShort";

export default function AvatarProfile () {
    const user = useSelector(store => store.user)
    const isOnLine = useOnLine()
    const name = useMemo(() => getFullName(user), [user]);
    
    return (
        <React.Fragment>
            <CustomBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                online={isOnLine}
            >  
                <Avatar 
                    src={user.image} 
                    srcSet={user.image}
                    children={getShort(name)}
                />
            </CustomBadge>
        </React.Fragment>
    );
}