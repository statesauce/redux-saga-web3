import { createSelector } from "reselect";

const getLatestBlockNumber = state =>
  state.blocks && state.blocks.headers ? state.blocks.latest : null;
const getBlockHeaders = state =>
  state.blocks && state.blocks.headers ? state.blocks.headers : null;

export const getLatestBlockHeader = createSelector(
  getLatestBlockNumber,
  getBlockHeaders,
  (latest, headers) => headers[latest]
);
