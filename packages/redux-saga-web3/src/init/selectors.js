import { createSelector } from "reselect";
import {
  INIT,
  STATUS,
  IS_LOADING,
  ERROR,
  NETWORK,
  ACCOUNTS,
} from "./stateKeys";

const selectInit = state => state.get(INIT);

const selectStatus = createSelector(
  selectInit,
  state => (state.has(STATUS) ? state.get(STATUS) : null)
);
const selectIsLoading = createSelector(
  selectInit,
  state => (state.has(IS_LOADING) ? state.get(IS_LOADING) : null)
);
const selectError = createSelector(
  selectInit,
  state => (state.has(ERROR) ? state.get(ERROR) : null)
);
const selectNetwork = createSelector(
  selectInit,
  state => (state.has(NETWORK) ? state.get(NETWORK) : null)
);
const selectAccounts = createSelector(
  selectInit,
  state => (state.has(ACCOUNTS) ? state.get(ACCOUNTS) : null)
);

export default {
  selectInit,
  selectStatus,
  selectIsLoading,
  selectError,
  selectNetwork,
  selectAccounts,
};
