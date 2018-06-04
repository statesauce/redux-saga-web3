import accountsActions from "./accounts/actions";
import accountsReducer from "./accounts/reducer";
import accountsSaga from "./accounts/saga";
import accountsSelectors from "./accounts/selectors";
import accountsTypes from "./accounts/types";

const actions = {
  accounts: accountsActions,
};

const reducers = {
  accounts: accountsReducer,
};

const sagas = {
  accounts: accountsSaga,
};

const selectors = {
  accounts: accountsSelectors,
};

const types = {
  accounts: accountsTypes,
};

export { actions, reducers, sagas, selectors, types };
