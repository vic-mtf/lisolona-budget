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
    setting: {
      network: {
        rttData: [],
      },
    },
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
          playings: {
            targetId: null,
            id: null,
          },
        },
        blink: {},
        scrollTo: null,
      },
      notifications: {
        blink: {},
        confirmDelete: {
          open: false,
        },
      },
      contacts: {
        blink: {},
        confirmDelete: {
          open: false,
        },
      },
      calls: {
        blink: {},
        confirmDelete: null,
        info: {
          open: false,
        },
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
