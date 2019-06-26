import { createSelector } from "reselect";

const selectInit = state => state.get("init");

const selectStatus = createSelector(
  selectInit,
  state => (state && state.has("status") ? state.get("status") : null)
);
const selectIsInitialized = createSelector(
  selectInit,
  state => (state && state.has("isInitialized") ? state.get("isInitialized") : false)
);
const selectError = createSelector(
  selectInit,
  state => (state && state.has("error") ? state.get("error") : null)
);
const selectNetwork = createSelector(
  selectInit,
  state => (state && state.has("network") ? state.get("network") : null)
);
const selectAccounts = createSelector(
  selectInit,
  state => (state && state.has("accounts") ? state.get("accounts") : null)
);

export default {
  selectInit,
  selectStatus,
  selectIsInitialized,
  selectError,
  selectNetwork,
  selectAccounts,
};
