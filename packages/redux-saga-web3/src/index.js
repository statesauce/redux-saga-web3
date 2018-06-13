import {
  accountsActions,
  accountsReducer,
  accountsSaga,
  accountsSelectors,
  accountsTypes
} from './accounts'

import blocksActions from './blocks/actions'
import blocksReducer from './blocks/reducer'
import blocksSaga from './blocks/saga'
import * as blocksSelectors from './blocks/selectors'
import * as blocksTypes from './blocks/types'

const actions = {
  accounts: accountsActions,
  blocks: blocksActions
}

const reducers = {
  accounts: accountsReducer,
  blocks: blocksReducer
}

const sagas = {
  accounts: accountsSaga,
  blocks: blocksSaga
}

const selectors = {
  accounts: accountsSelectors,
  blocks: blocksSelectors
}

const types = {
  accounts: accountsTypes,
  blocks: blocksTypes
}

export { actions, reducers, sagas, selectors, types }
