import { useContext, createContext } from "react";

export const LocalStoreDataContext = createContext();
const useLocalStoreData = () => useContext(LocalStoreDataContext);
export default useLocalStoreData;
