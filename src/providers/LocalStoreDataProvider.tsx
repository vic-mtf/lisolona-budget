import React, { useCallback, useMemo } from "react";
import deepMerge, { getValueByKey, setValueByKey } from "@/utils/mergeDeep";
import { LocalStoreDataContext } from "@/hooks/useLocalStoreData";

interface LocalStoreDataProviderProps {
  children: React.ReactNode;
}

const { Provider } = LocalStoreDataContext;

const LocalStoreDataProvider = React.memo(function LocalStoreDataProvider({
  children,
}: LocalStoreDataProviderProps) {
  const data = useMemo(
    () =>
      ({
        app: {
          downloads: {
            images: {},
            voices: {},
            videos: {},
            audios: {},
            docs: {},
          },
          uploads: {
            images: {},
            voices: {},
            videos: {},
            audios: {},
            docs: {},
          },
          requests: {},
          playings: {
            audio: null,
            video: null,
          },
          contacts: {
            status: {},
          },
        },
        conference: {
          setup: {
            devices: {
              audio: null,
              screen: {
                stream: null,
                controller: null,
              },
              camera: {
                stream: null,
                processedStream: null,
              },
              processedCameraStream: {
                background: {},
              },
              microphone: {
                stream: null,
              },
            },
          },
          meeting: {
            startedAt: null,
            actions: {
              localPresentation: {
                annotation: {
                  stage: {
                    shapes: [],
                  },
                },
              },
            },
          },
        },
      }) as Record<string, unknown>,
    []
  );

  const setData = useCallback(
    (updateData: string | Record<string, unknown>, value?: unknown) => {
      if (typeof updateData === "string")
        setValueByKey(data, updateData, value);
      else {
        const states = deepMerge(data, updateData);
        Object.keys(states).forEach((key) => {
          data[key] = states[key];
        });
      }
    },
    [data]
  );

  const getData = useCallback(
    (key: string | ((data: Record<string, unknown>) => unknown)) =>
      typeof key === "function" ? key(data) : getValueByKey(data, key),
    [data]
  );

  return <Provider value={[getData, setData]}>{children}</Provider>;
});

export default LocalStoreDataProvider;
