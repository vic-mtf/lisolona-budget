import Button from '@mui/material/Button';
import MessageBox from '../message-box/MessageBox';

export default function MessageItem ({message, onLoad }) {
    return (
        <MessageBox
            {...message}
        />
    );
}