import accountsActions from "./accounts/actions";
import accountsReducer from "./accounts/reducer";
import accountsSaga from "./accounts/saga";
import accountsSelectors from "./accounts/selectors";
import accountsTypes from "./accounts/types";

import blocksActions from "./blocks/actions";
import blocksReducer from "./blocks/reducer";
import blocksSaga from "./blocks/saga";
import * as blocksSelectors from "./blocks/selectors";
import blocksTypes from "./blocks/types";

const actions = {
  accounts: accountsActions,
  blocks: blocksActions,
};

const reducers = {
  accounts: accountsReducer,
  blocks: blocksReducer
};

const sagas = {
  accounts: accountsSaga,
  blocks: blocksSaga
};

const selectors = {
  accounts: accountsSelectors,
  blocks: blocksSelectors
};

const types = {
  accounts: accountsTypes,
  blocks: blocksTypes
};

export { actions, reducers, sagas, selectors, types };
