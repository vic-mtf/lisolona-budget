const deleteInArrayDataItemById = (state, action) => {
  const { id, key } = action.payload;
  if (!Array.isArray(state.app[key])) return;
  state.app[key] = state.app[key].filter((item) => item.id !== id);
  //   if (key === "discussions" && state.app.messages[id])
  //     delete state.app.messages[id];
};

export default deleteInArrayDataItemById;
