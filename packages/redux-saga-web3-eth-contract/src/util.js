export function pickAddress(action) {
  if (action.meta && action.meta.options && action.meta.options.at)
    return action.meta.options.at;
  if (action.payload && action.payload.options && action.payload.options.at)
    return action.payload.options.at;
  return null;
}
