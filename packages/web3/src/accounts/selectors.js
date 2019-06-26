import keys from "./stateKeys";

const selectAccounts = state =>
  state[keys.ACCOUNTS][keys.ITEMS] ? state[keys.ACCOUNTS][keys.ITEMS] : null;

export default {
  selectAccounts,
};
