import keys from "./stateKeys";

const selectId = state =>
  state[keys.NETWORK][keys.ID] ? state[keys.NETWORK][keys.ID] : null;

export default {
  selectId,
};
