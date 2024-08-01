import { useContext } from "react";
import { LocalStoreDataContext } from "../components/LocalStoreDataProvider";

const useLocalStoreData = () => useContext(LocalStoreDataContext);
export default useLocalStoreData;
