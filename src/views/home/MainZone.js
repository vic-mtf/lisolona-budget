import { useMemo, useState } from 'react';
import Rejoin from './rejoin/Rejoin';
import { comparePathnames } from './Header';
import { useLocation } from 'react-router-dom';
import Checking from './checking/Checking';

export default function MainZone () {
    const [options, setOptions] = useState({});
    const location = useLocation();
    const checking = useMemo(() => 
        comparePathnames(location.pathname, 'home/checking'),
        [location.pathname]
    );

    return (
        <>
        {checking ? 
        <Checking
            setOptions={setOptions}
            options={options} 
        />:
            <Rejoin 
                options={options} 
                setOptions={setOptions}
            />}
        </>
    );
}



