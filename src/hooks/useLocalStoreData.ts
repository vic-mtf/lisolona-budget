import { useContext, createContext, useMemo, useCallback } from "react";

type GetDataFn = (key: string | ((data: Record<string, unknown>) => unknown)) => unknown;
type SetDataFn = (key: string | Record<string, unknown>, value?: unknown) => void;
type LocalStoreContextValue = [GetDataFn, SetDataFn];

export const LocalStoreDataContext = createContext<LocalStoreContextValue>(
  [() => undefined, () => undefined]
);

const useLocalStoreData = (keySearch?: string): [GetDataFn, SetDataFn] => {
  const [getData, setData] = useContext(LocalStoreDataContext);

  const getDataByKeySearch = useCallback(
    (key?: string | string[]) => {
      if (keySearch) {
        const data = getData(keySearch) as Record<string, unknown>;
        if (key === undefined) return data;
        else {
          const k = Array.isArray(key) ? key : (key as string)?.split(".");
          return k?.reduce(
            (acc: Record<string, unknown> | undefined, k: string) =>
              (acc as Record<string, unknown>)?.[k],
            data
          );
        }
      } else return getData(key as string);
    },
    [keySearch, getData]
  );

  const setDataByKeySearch = useCallback(
    (key: string | Record<string, unknown>, value?: unknown) => {
      if (keySearch) {
        const currentData = getData(keySearch) as Record<string, unknown>;
        setData(keySearch, {
          ...currentData,
          ...(typeof key === "string"
            ? { ...((currentData)?.[key] as Record<string, unknown>), [key]: value }
            : key),
        });
      } else setData(key, value);
    },
    [keySearch, getData, setData]
  );

  if (keySearch)
    return [getDataByKeySearch as GetDataFn, setDataByKeySearch];

  return [getData, setData];
};

interface SmartKeyConfig {
  baseKey: string;
  paths: Record<string, string[]>;
}

export const useSmartKey = ({ baseKey, paths }: SmartKeyConfig) => {
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
