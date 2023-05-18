import { createContext, useContext, useRef } from "react"

const Data = createContext();
export const useData = () => useContext(Data);

export default function DataProivder({children}) {
    const messagesRef = useRef({});
    const pushMessages = ({id, messages, total}) => messagesRef.current[id] = {messages, total};
    const values = [
        {messagesRef},
        {pushMessages}
    ];
    return (<Data.Provider value={values}>{children}</Data.Provider>)
}