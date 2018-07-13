import { createSelector } from "reselect";

const selectTokens = state => state.getIn(["ERC20Tokens", "contracts"]);
const selectAddress = (_, props) => props.address;
const selectUser = (_, props) => props.user;

export const selectToken = createSelector(
  selectTokens,
  selectAddress,
  (tokens, address) => (tokens.has(address) ? tokens.get(address) : null)
);

export const selectBalances = createSelector(
  selectToken,
  token => (token && token.has("balanceOf") ? token.get("balanceOf") : null)
);

export const selectBalanceOf = createSelector(
  selectBalances,
  selectUser,
  (balances, user) =>
    balances && balances.has(user) ? balances.get(user) : null
);
