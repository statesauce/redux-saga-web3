const ACCOUNTS = "accounts";
const ITEMS = "items";

const getAccounts = state =>
  state.get(ACCOUNTS) && state.get(ACCOUNTS)[ITEMS]
    ? state.get(ACCOUNTS)[ITEMS]
    : null;

export default {
  getAccounts,
};
