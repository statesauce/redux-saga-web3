import {
  accountsActions,
  accountsReducer,
  accountsSaga,
  accountsSelectors,
  accountsTypes,
} from "./accounts";

import blocksActions from "./blocks/actions";
import blocksReducer from "./blocks/reducer";
import blocksSaga from "./blocks/saga";
import * as blocksSelectors from "./blocks/selectors";
import * as blocksTypes from "./blocks/types";

import {
  networkActions,
  networkReducer,
  networkSaga,
  networkSelectors,
  networkTypes,
} from "./network";

const actions = {
  accounts: accountsActions,
  blocks: blocksActions,
  network: networkActions,
};

const reducers = {
  accounts: accountsReducer,
  blocks: blocksReducer,
  network: networkReducer,
};

const sagas = {
  accounts: accountsSaga,
  blocks: blocksSaga,
  network: networkSaga,
};

const selectors = {
  accounts: accountsSelectors,
  blocks: blocksSelectors,
  network: networkSelectors,
};

const types = {
  accounts: accountsTypes,
  blocks: blocksTypes,
  network: networkTypes,
};

export { actions, reducers, sagas, selectors, types };
