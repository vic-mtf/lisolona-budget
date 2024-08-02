import Dialog from "../../../../components/Dialog";
import { useEffect, useRef, useState } from "react";
import ScheduleMeetingContent from "./ScheduleMeetingContent";

export default function ScheduleMeeting () {
    const [target, setTarget] = useState(null);
    const rootRef = useRef();

    useEffect(() => {
        const name = '__schedule-meeting-form';
        const root = document.getElementById('root');
        const handleOpenForm = ({ detail }) => {
            if (detail?.name === name) 
                setTarget(detail?.target)
        };
        root.addEventListener(name, handleOpenForm);
        return () => {
            root.removeEventListener(name, handleOpenForm);
        }
    }, []);

    return (
        <>
            <Dialog 
                open={Boolean(target)} 
                maxWidth={false}
                PaperProps={{
                    sx: { overflow: 'hidden', position: 'relative', },
                    component: 'form',
                    ref: rootRef,
                }}
            >
                <ScheduleMeetingContent
                    formRef={rootRef}
                    target={target}
                    onClose={() => setTarget(null)}
                />
            </Dialog>
           
        </>
    );
}



