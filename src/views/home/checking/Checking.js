import { Box as MuiBox } from '@mui/material';
import React from "react";
import { Navigate } from "react-router-dom";
import CheckingUser from "./CheckingUser";
import CheckingDevice from "./CheckingDevice";

export default function Checking ({options, setOptions}) {

    return (
        <MuiBox
            px={2}
            py={1}
        >
        { options ? 
            (
            <React.Fragment>
                <CheckingUser/>
                <CheckingDevice/>
            </React.Fragment>
            ) : (<Navigate to="/home"/>)}
        </MuiBox>
    )
}