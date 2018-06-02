import { takeEvery } from 'redux-saga/effects'
import { types } from '../constants'

import web3WithChildrenSaga, { web3Saga, initWeb3 } from './initWeb3'
import childAccountsSaga, { accountsSaga, pollAccounts, getAccounts } from './accounts'
import contractSaga, { initContract } from './contract'

export const sagas = {
  initWeb3,
  getAccounts,
  pollAccounts,
  initContract
}

export {
  web3Saga,
  accountsSaga,
  contractSaga
}

export {
  web3WithChildrenSaga,
  childAccountsSaga
}

export default function * rootSaga () {
  yield takeEvery(types.WEB3.INIT_REQUEST, web3WithChildrenSaga)
}
