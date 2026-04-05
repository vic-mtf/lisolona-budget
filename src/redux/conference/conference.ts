import { createSlice } from '@reduxjs/toolkit';
import deepMerge, { setValueByKey } from '../../utils/mergeDeep';
import initialState from './initialState';
import { isArray, cloneDeep } from 'lodash';

const safeGet = (obj, path) => {
  if (!path) return obj;
  return path
    .split('.')
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
};

const safeSet = (obj, path, value) => {
  if (!path) return;
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (typeof current[keys[i]] !== 'object' || current[keys[i]] === null) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = cloneDeep(value);
};

const conference = createSlice({
  name: 'conference',
  initialState,
  reducers: {
    updateConferenceData(state, actions) {
      const { data, key } = actions.payload;
      if (Array.isArray(key) || typeof key === 'string') {
        (Array.isArray(key) ? key : [key]).forEach((k, index) => {
          const states = setValueByKey(
            state,
            k,
            isArray(data) ? data[index] : data
          );
          Object.keys(states).forEach((key) => {
            state[key] = states[key];
          });
        });
      } else {
        const states = deepMerge(state, data);
        Object.keys(states).forEach((key) => {
          state[key] = states[key];
        });
      }
    },

    /**
     * Initialise tout ou une partie du state conference.
     * @param {object} state - Le state Redux
     * @param {object} [action] - Payload optionnel : { key?: string | string[] }
     * Exemple :
     *  - initConferenceData()
     *  - initConferenceData({ key: "meeting.view.localParticipant" })
     *  - initConferenceData({ key: ["setup.devices.camera", "meeting.view"] })
     */
    initConferenceData(state, action) {
      const { key } = action.payload || {};

      // 🧩 Cas 1 : reset complet
      if (!key) {
        Object.keys(initialState).forEach((k) => {
          state[k] = cloneDeep(initialState[k]);
        });
        return;
      }

      // 🧩 Cas 2 : un ou plusieurs chemins à reset
      const keys = Array.isArray(key) ? key : [key];

      keys.forEach((path) => {
        const initialSub = safeGet(initialState, path);
        if (initialSub !== undefined) {
          safeSet(state, path, initialSub);
        } else {
          console.warn(
            `[initConferenceData] Clé inexistante ignorée: "${path}"`
          );
        }
      });
    },
  },
});

export const { updateConferenceData, initConferenceData } = conference.actions;
export default conference.reducer;
