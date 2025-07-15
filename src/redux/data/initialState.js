export const initialState = {
  targetView: null,
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
    actions: {
      messaging: {
        info: {
          open: false,
        },
        draft: {},
        reply: {},
        medias: {
          viewer: {
            open: false,
            id: null,
          },
        },
        blink: {},
      },
      notifications: {
        blink: {},
        confirmDelete: null,
      },
      contacts: {
        blink: {},
        confirmDelete: null,
      },
    },
  },
  chatBox: {
    footer: {
      toolbar: true,
      emojiBar: false,
      recording: false,
      files: {
        // [targetId]: [] list discussion voice notes
      },
    },
  },
};
