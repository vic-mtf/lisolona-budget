import { useContext, createContext, useMemo, useCallback } from "react";

export const LocalStoreDataContext = createContext();

const useLocalStoreData = (keySearch) => {
  const [getData, setData] = useContext(LocalStoreDataContext);

  const getDataByKeySearch = useCallback(
    (key) => {
      if (keySearch) {
        const data = getData(keySearch);
        if (key === undefined) return data;
        else {
          const k = Array.isArray(key) ? key : key?.split(".");
          return k?.reduce((acc, k) => acc?.[k], data);
        }
      } else return getData(key);
    },
    [keySearch, getData]
  );

  const setDataByKeySearch = useCallback(
    (key, value) => {
      if (keySearch) {
        setData(keySearch, {
          ...getData(keySearch),
          ...(typeof key === "string" ? { [key]: value } : key),
        });
      } else setData(key, value);
    },
    [keySearch, getData, setData]
  );

  if (keySearch) return [getDataByKeySearch, setDataByKeySearch];

  return [getData, setData];
};

export const useSmartKey = ({ baseKey, paths }) => {
  const [getData] = useLocalStoreData();
  return useMemo(() => {
    let selectedKey = "";
    let selectedPath = "";

    const mainKey = Object.keys(paths)[0];
    const variations = paths[mainKey];

    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i];
      const testKey = baseKey.replace(".key", `.${variation}`);
      if (getData(testKey)) {
        selectedKey = testKey;
        selectedPath = variation;
        break;
      }
    }

    if (!selectedKey) {
      selectedKey = baseKey.replace(".key", `.${variations[0]}`);
      selectedPath = variations[0];
    }

    return {
      key: selectedKey,
      selectedPath,
      isSelected: selectedPath === variations[1],
    };
  }, [baseKey, paths, getData]);
};

export default useLocalStoreData;
