import { createSelector } from "reselect";
import keys from "./stateKeys";

const selectInit = state => state[keys.INIT];

const selectStatus = createSelector(
  selectInit,
  state => (state && state[keys.STATUS] ? state[keys.STATUS] : null)
);
const selectIsInitialized = createSelector(
  selectInit,
  state =>
    state && state[keys.IS_INITIALIZED] ? state[keys.IS_INITIALIZED] : false
);
const selectError = createSelector(
  selectInit,
  state => (state && state[keys.ERROR] ? state[keys.ERROR] : null)
);
const selectNetwork = createSelector(
  selectInit,
  state => (state && state[keys.NETWORK] ? state[keys.NETWORK] : null)
);
const selectAccounts = createSelector(
  selectInit,
  state => (state && state[keys.ACCOUNTS] ? state[keys.ACCOUNTS] : null)
);

export default {
  selectInit,
  selectStatus,
  selectIsInitialized,
  selectError,
  selectNetwork,
  selectAccounts,
};
