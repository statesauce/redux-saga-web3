export function pickAddress(action) {
  if (action.payload && action.meta) {
    switch (action) {
      case action.meta.options && action.meta.options.at:
        return action.meta.options.at;
      case action.payload.options && action.payload.options.at:
        return action.payload.options.at;
      default:
        return false;
    }
  } else return false;
}
