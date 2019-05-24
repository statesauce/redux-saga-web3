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
  initActions,
  initReducer,
  initSaga,
  initSelectors,
  initTypes,
} from "./init";

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
  init: initActions,
  network: networkActions,
};

const reducers = {
  accounts: accountsReducer,
  blocks: blocksReducer,
  init: initReducer,
  network: networkReducer,
};

const sagas = {
  accounts: accountsSaga,
  blocks: blocksSaga,
  init: initSaga,
  network: networkSaga,
};

const selectors = {
  accounts: accountsSelectors,
  blocks: blocksSelectors,
  init: initSelectors,
  network: networkSelectors,
};

const types = {
  accounts: accountsTypes,
  blocks: blocksTypes,
  init: initTypes,
  network: networkTypes,
};

export { actions, reducers, sagas, selectors, types };
