import {
  accountsActions,
  accountsInitialState,
  accountsReducer,
  accountsSaga,
  accountsSelectors,
  accountsTypes,
} from "./accounts";

import blocksActions from "./blocks/actions";
import blocksReducer, { blocksInitialState } from "./blocks/reducer";
import blocksSaga from "./blocks/saga";
import * as blocksSelectors from "./blocks/selectors";
import * as blocksTypes from "./blocks/types";

import {
  initActions,
  initInitialState,
  initReducer,
  initSaga,
  initSelectors,
  initTypes,
} from "./init";

import {
  networkActions,
  networkInitialState,
  networkReducer,
  networkSaga,
  networkSelectors,
  networkTypes,
} from "./network";

import {
  contextActions,
  contextInitialState,
  contextReducer,
  contextSaga,
  contextTypes,
} from "./context";

import * as immutable from "./immutable";

const actions = {
  accounts: accountsActions,
  blocks: blocksActions,
  init: initActions,
  network: networkActions,
  context: contextActions,
};

const initialState = {
  accounts: accountsInitialState,
  blocks: blocksInitialState,
  init: initInitialState,
  network: networkInitialState,
  context: contextInitialState,
};

const reducers = {
  accounts: accountsReducer,
  blocks: blocksReducer,
  init: initReducer,
  network: networkReducer,
  context: contextReducer,
};

const sagas = {
  accounts: accountsSaga,
  blocks: blocksSaga,
  init: initSaga,
  network: networkSaga,
  context: contextSaga,
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
  context: contextTypes,
};

export { actions, initialState, reducers, sagas, selectors, types, immutable };
