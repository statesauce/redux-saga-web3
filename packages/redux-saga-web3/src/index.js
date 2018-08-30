import ReduxSagaWeb3EthContract from "redux-saga-web3-eth-contract";

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

const eth = {
  accounts: {
    actions: accountsActions,
    reducer: accountsReducer,
    saga: accountsSaga,
    selectors: accountsSelectors,
    types: accountsTypes,
  },
  blocks: {
    actions: blocksActions,
    reducer: blocksReducer,
    saga: blocksSaga,
    selectors: blocksSelectors,
    types: blocksTypes,
  },
  network: {
    actions: networkActions,
    reducer: networkReducer,
    saga: networkSaga,
    selectors: networkSelectors,
    types: networkTypes,
  },
  Contract: ReduxSagaWeb3EthContract,
};

export { eth };
