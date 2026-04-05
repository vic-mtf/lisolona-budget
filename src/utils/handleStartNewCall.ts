import store from '../redux/store';

export const startNewCall = async (callTarget) => {
  window.open(import.meta.env.BASE_URL + '/conference/create', '_blank');

  store.dispatch({
    type: 'conference/updateConferenceData',
    payload: {
      key: 'callTarget',
      data: callTarget,
    },
  });
};
