import React from "react"
import Profile from "./Profile"

export default React.memo(function Alert ({type, ...otherProps}) {
    return (
        <React.Fragment>
            {type === 'profile' && <Profile {...otherProps}/>}
        </React.Fragment> 
    )
})