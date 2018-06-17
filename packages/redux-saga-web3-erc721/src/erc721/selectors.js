import { createSelector } from "reselect";

const selectTokens = state => state.ERC721Tokens.contracts;
const selectAt = (_, props) => props.at;
const selectOwner = (_, props) => props.owner;

export const selectToken = createSelector(
  selectTokens,
  selectAt,
  (tokens, at) => (at in tokens ? tokens[at] : null)
);

export const selectBalances = createSelector(
  selectToken,
  (token, at) => (token && token.balances ? token.balances : null)
);

export const selectBalanceOf = createSelector(
  selectBalances,
  selectOwner,
  (balances, owner) => (balances && owner in balances ? balances[owner] : null)
);
