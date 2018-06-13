const getAccounts = state =>
  state.accounts && state.accounts.items ? state.accounts.items : null;

export default {
  getAccounts,
};
