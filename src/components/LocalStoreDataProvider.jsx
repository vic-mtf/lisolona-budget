import React from "react";
import { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import deepMerge, { getValueByKey, setValueByKey } from "../utils/mergeDeep";
import { LocalStoreDataContext } from "../hooks/useLocalStoreData";

const LocalStoreDataProvider = React.memo(({ children }) => {
  const data = useMemo(
    () => ({
      // messages: {},
      // meetingMessages: [],
      // meetingCode: null,
      // secretCode: (Date.now() * 17913).toString(16),
      // downloads: [],
      // voices: [],
      // videos: [],
      // images: [],
      // docs: [],
      // audioStream: null,
      // videoStream: null,
      // screenStream: null,
      // streams: {
      //   audio: null,
      //   video: null,
      //   audioVideo: null,
      //   screen: {
      //     audio: null,
      //     video: null,
      //     audioVideo: null,
      //   },
      // },
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
        // ringtones: {
        //   warning: {
        //     url: null,
        //     preloaded: true,
        //   },
        //   error: {
        //     url: null,
        //     preloaded: true,
        //   },
        //   alert: {
        //     url: null,
        //     preloaded: true,
        //   },
        //   outgoingCall: {
        //     url: null,
        //     preloaded: false,
        //   },
        //   incomingCall: {
        //     url: null,
        //     preloaded: true,
        //   },
        //   loading: {
        //     url: null,
        //     preloaded: false,
        //   },
        // },
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

const { Provider } = LocalStoreDataContext;

LocalStoreDataProvider.displayName = "LocalStoreDataProvider";

LocalStoreDataProvider.propTypes = {
  children: PropTypes.node,
};

export default LocalStoreDataProvider;
