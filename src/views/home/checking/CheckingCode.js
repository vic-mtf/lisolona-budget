import React, { useEffect, useState } from "react";
import { Backdrop, LinearProgress } from "@mui/material";
import Typography from "../../../components/Typography";
import InputCode from "../../../components/InputCode";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import queryString from "query-string";

export default function CheckingCode ({setOptions, message}) {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const values = useMemo(() => 
        queryString.parse(location.search)?.code?.split('') || [], 
        [location]
    );
    const [code, setCode] = useState();
 
    useEffect(() => {
        if(code) {
            setLoading(true);
        }
    },[code]);

    return (
        <React.Fragment>
            <InputCode
                length={9}
                size={38}
                values={values}
                onComplete={(code) => {
                    setCode(code.join(''));
                    console.log(code);
                }}
              />
              <Backdrop
                open={loading}
                sx={{
                 top: 82,
                }}
                children={
                    <React.Fragment>
                        <LinearProgress 
                            sx={{
                                width: '100%',
                                position: 'absolute',
                                top: 0,
                            }} 
                        />
                        {message && 
                        <Typography mt={2}>{message}</Typography>}
                    </React.Fragment>
                }
              />
        </React.Fragment>
    );
}