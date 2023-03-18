import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../utils/SocketIOProvider";
import TeleconferenceProvider from "../../utils/useTeleconferenceProvider";
import Container from "./Container";
import { addTeleconference } from "../../redux/teleconference";
import ResizableFrame from "./ResizableFrame";

export default function Teleconference () {
    const isCalling = useSelector(store => store?.teleconference?.isCalling);
    const [screenSize, setScreenSize] = useState('large');

    const optionsRef= useRef();
    const socket = useSocket();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleIncomingCall = ({from, details, room}) => {
            const { options, type } = details;
            optionsRef.current = options
            dispatch(addTeleconference({
                key: 'data',
                data: {
                    isCalling: true,
                    variant: 'incoming',
                    clientId: room ? room?._id : from?._id,
                    type,
                }
            }));
        };
        socket?.on('incoming-call', handleIncomingCall);
        if(!isCalling)
            optionsRef.current = null;
        return () => {
            socket?.off('incoming-call', handleIncomingCall);
            optionsRef.current = null;
        }
    },[dispatch, socket, isCalling]);

    return (
        <ResizableFrame
            open={isCalling}
            size={screenSize}
        >
            <TeleconferenceProvider 
                options={optionsRef.current}
                otherProps={{
                    screenSize, 
                    setScreenSize,
                }}
            >
                <Container/>
            </TeleconferenceProvider>
        </ResizableFrame>
    );
}