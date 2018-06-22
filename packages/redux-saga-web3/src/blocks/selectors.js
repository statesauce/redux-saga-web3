import { createSelector } from "reselect";

const BLOCKS = "blocks";
const HEADERS = "headers";
const LATEST = "latest";

const getLatestBlockNumber = state =>
  state.get(BLOCKS) && state.get(BLOCKS)[HEADERS]
    ? state.get(BLOCKS)[LATEST]
    : null;

const getBlockHeaders = state =>
  state.get(BLOCKS) && state.get(BLOCKS)[HEADERS]
    ? state.get(BLOCKS)[HEADERS]
    : null;

export const getLatestBlockHeader = createSelector(
  getLatestBlockNumber,
  getBlockHeaders,
  (latest, headers) => headers[latest]
);
