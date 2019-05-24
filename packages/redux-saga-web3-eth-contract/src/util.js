export function pickAddress(action) {
  if (action.meta && action.meta.options && action.meta.options.at)
    return action.meta.options.at;
  if (action.payload && action.payload.options && action.payload.options.at)
    return action.payload.options.at;
  return null;
}

export function isSendable(method) {
  const { constant, payable, stateMutability } = method;
  if (constant) return false;
  if (stateMutability) {
    if (stateMutability === "payable") return true;
    if (stateMutability === "nonpayable") return true;
  }
  if (payable) return true;
  return false;
}
