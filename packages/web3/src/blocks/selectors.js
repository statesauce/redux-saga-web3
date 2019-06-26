// import { createSelector } from "reselect";
import keys from "./stateKeys";

const selectLatestBlockNumber = state =>
  state[keys.BLOCKS][keys.HEADERS] ? state[keys.BLOCKS][keys.LATEST] : null;

const selectBlockHeaders = state =>
  state[keys.BLOCKS][keys.HEADERS] ? state[keys.BLOCKS][keys.HEADERS] : null;

// export const selectLatestBlockHeader = createSelector(
//   selectLatestBlockNumber,
//   selectBlockHeaders,
//   (latest, headers) => headers[latest]
// );
