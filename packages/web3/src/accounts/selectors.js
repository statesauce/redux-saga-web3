import get from "lodash.get";
import hasIn from "lodash.hasin";
import keys from "./stateKeys";

const selectAccounts = (state, path = "") =>
  hasIn(state, path, keys.ACCOUNTS, keys.ITEMS)
    ? get(state, path, keys.ACCOUNTS, keys.ITEMS)
    : null;

export default {
  selectAccounts,
};
