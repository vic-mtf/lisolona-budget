import { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import Button from "../../../../components/Button";
export default function PromptAlert () {
    const [type, setType] = useState(null);
    const callbackRef = useRef();
    const title = messages[type]?.title;
    const content =  messages[type]?.content;

    const handleAcceptAction = () => {
      setType(null);
      if(typeof callbackRef.current === 'function')
        callbackRef.current();
    }
    useEffect(() => {
        const name = '_prompt-alert-resource';
        const root = document.getElementById('root');
        const handlePromptAlertResource = event => {
          setType(event.detail.type);
          callbackRef.current = event.detail.callback;
        };
        root.addEventListener(
          name, 
          handlePromptAlertResource
        );
        return () => {
          root.removeEventListener(
            name, 
            handlePromptAlertResource
          );
        };
    },[])

    return (
        <Dialog 
            open={Boolean(type)} 
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText
              variant="body2"
            >
              {content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleAcceptAction}
            >
              D'accord
            </Button>
          </DialogActions>
        </Dialog>
    )
}