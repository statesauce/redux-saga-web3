import { web3Saga, initWeb3 } from './web3'
import { accountsSaga, getAccounts } from './accounts'
import { contractSaga, initContract } from './contract'

import { all, fork } from 'redux-saga/effects'

export const generators = {
  initWeb3,
  getAccounts,
  initContract
}

export function * rootSaga () {
  yield all([...Object.values(sagas).map(saga => fork(saga))])
}

const sagas = {
  web3Saga,
  accountsSaga,
  contractSaga
}

export default sagas
