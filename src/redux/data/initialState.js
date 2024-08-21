export const initialState = {
  discussionTarget: null,
  notifications: [],
  calls: [],
  dialog: null,
  activeCall: false,
  app: {
    loaded: false,
    contacts: [],
    discussions: [],
    notifications: [],
    calls: [],
    messages: {},
  },
  chatBox: {
    footer: {
      toolbar: true,
      emojiBar: false,
      recording: false,
      files: [],
    },
  },
};
