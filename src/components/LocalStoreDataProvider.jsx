import React from "react";
import { createContext, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import deepMerge, { getValueByKey, setValueByKey } from "../utils/mergeDeep";

const LocalStoreDataProvider = React.memo(({ children }) => {
  const data = useMemo(
    () => ({
      messages: {},
      meetingMessages: [],
      meetingCode: null,
      secretCode: (Date.now() * 17913).toString(16),
      downloads: [],
      voices: [],
      videos: [],
      audioStream: null,
      videoStream: null,
      screenStream: null,
      streams: {
        audio: null,
        video: null,
        screen: null,
      },
      app: {
        downloads: {
          voices: {},
          videos: {},
          documents: {},
        },
        ringtones: {
          warning: {
            url: null,
            preloaded: true,
          },
          error: {
            url: null,
            preloaded: true,
          },
          alert: {
            url: null,
            preloaded: true,
          },
          outgoingCall: {
            url: null,
            preloaded: false,
          },
          incomingCall: {
            url: null,
            preloaded: true,
          },
          loading: {
            url: null,
            preloaded: false,
          },
        },
        playings: {
          voices: {},
          videos: {},
        },
        contacts: {
          status: {},
        },
      },
    }),
    []
  );

  const setData = useCallback(
    (updateData, value) => {
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
    (key) => (typeof key === "function" ? key(data) : getValueByKey(data, key)),
    [data]
  );

  return <Provider value={[getData, setData]}>{children}</Provider>;
});

export const LocalStoreDataContext = createContext();

const { Provider } = LocalStoreDataContext;

LocalStoreDataProvider.displayName = "LocalStoreDataProvider";

LocalStoreDataProvider.propTypes = {
  children: PropTypes.node,
};

export default LocalStoreDataProvider;
