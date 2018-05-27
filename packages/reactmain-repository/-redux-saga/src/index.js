import reducers from "./reducers";
import sagas from "./sagas";

import accountsReducer from "./accounts/reducer";
import accountsSaga from "./accounts/saga";
import accountsTypes from "./accounts/types";

import web3Reducer from "./web3/reducer";
import web3Saga from "./web3/saga";
import web3Types from "./web3/types";

const reducers = {
  accounts: accountsReducer,
  web3: web3Reducer
};

const sagas = {
  accounts: accountsSaga,
  web3: web3Saga
};

const types = {
  accounts: accountsTypes,
  web3: web3Types
};

export { reducers, sagas, types };
