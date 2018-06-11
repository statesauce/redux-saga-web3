import { createSelector } from "reselect";

const selectTokens = state => state.tokens.contracts;
const selectAddress = (_, props) => props.address;
const selectUser = (_, props) => props.user;

export const selectToken = createSelector(
  selectTokens,
  selectAddress,
  (tokens, address) => (address in tokens ? tokens[address] : null)
);

export const selectBalances = createSelector(
  selectToken,
  (token, address) => (token && token.balances ? token.balances : null)
);

export const selectBalanceOf = createSelector(
  selectBalances,
  selectUser,
  (balances, user) => (balances && user in balances ? balances[user] : null)
);
