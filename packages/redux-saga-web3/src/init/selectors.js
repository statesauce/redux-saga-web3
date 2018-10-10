import { createSelector } from "reselect";

const selectInit = state => state.get("init");

const selectStatus = createSelector(
  selectInit,
  state => (state && state.has("status") ? state.get("status") : null)
);
const selectIsLoading = createSelector(
  selectInit,
  state => (state && state.has("isLoading") ? state.get("isLoading") : null)
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
  selectIsLoading,
  selectError,
  selectNetwork,
  selectAccounts,
};
