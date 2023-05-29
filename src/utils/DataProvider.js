import { createContext, useContext, useRef } from "react"

const Data = createContext();
export const useData = () => useContext(Data);

export default function DataProvider({children}) {
    const messagesRef = useRef({});
    const downloadsRef = useRef([]);
    const pushMessages = ({id, messages, total}) => messagesRef.current[id] = {messages, total};
    const values = [
        {messagesRef, downloadsRef},
        {pushMessages}
    ];
    return (<Data.Provider value={values}>{children}</Data.Provider>)
}