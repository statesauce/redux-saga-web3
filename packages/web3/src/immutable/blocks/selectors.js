// import { createSelector } from "reselect";

const BLOCKS = "blocks";
const HEADERS = "headers";
const LATEST = "latest";

const selectLatestBlockNumber = state =>
  state.hasIn([BLOCKS, HEADERS]) ? state.getIn([BLOCKS, LATEST]) : null;

const selectBlockHeaders = state =>
  state.hasIn([BLOCKS, HEADERS]) ? state.getIn([BLOCKS, HEADERS]) : null;

// export const selectLatestBlockHeader = createSelector(
//   selectLatestBlockNumber,
//   selectBlockHeaders,
//   (latest, headers) => headers.get(`${latest}`)
// );
