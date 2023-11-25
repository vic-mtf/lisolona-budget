// import ChatHeader from "../../../../main/chat-box/chat-header/ChatHeader";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import Button from '../../../../../components/Button';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import useMeetingUrl from './useMeetingUrl';

export default function CopyLinkButton () {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef();
    const inputRef = useRef();
    const url = useMeetingUrl();

    const handleCopyLink = useCallback(async (e) => {
    if(!copied) {
        try {
            if(navigator?.clipboard?.writeText)
                await navigator?.clipboard?.writeText(url);
            else {
                inputRef.current.select();
                document.execCommand('copy');
                e?.target.focus(); 
            }
            setCopied(true);
            timerRef.current = setTimeout(() => {
                setCopied(false)
            }, 2000);
        } catch (e) { console.log('Error', e); }
    }
    }, [url, copied]);

    useEffect(() => {
        return () => {
            window.clearTimeout(timerRef.current);
        };
    },[]);

    return (
        <>
            <Button
                startIcon={
                    copied ? <CheckOutlinedIcon/> : <ContentCopyIcon/>
                }
                onClick={handleCopyLink}
                fullWidth
            >Copier</Button>
            <input hidden ref={inputRef} value={url} />
        </>
    )
}