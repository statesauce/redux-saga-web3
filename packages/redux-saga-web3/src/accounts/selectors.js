const ACCOUNTS = "accounts";
const ITEMS = "items";

const selectAccounts = state =>
  state.hasIn([ACCOUNTS, ITEMS]) ? state.getIn([ACCOUNTS, ITEMS]) : null;

export default {
  selectAccounts,
};
