import { takeEvery } from 'redux-saga/effects'
import { types } from '../constants'

import web3WithChildrenSaga, { web3Saga, initWeb3 } from './initWeb3'
import childAccountsSaga, { accountsSaga, pollAccounts, getAccounts } from './accounts'
import childDefaultAccountSaga, { defaultAccountSaga, getDefaultAccount } from './defaultAccount'
import contractSaga, { initContract } from './contract'

export const sagas = {
  initWeb3,
  getAccounts,
  pollAccounts,
  getDefaultAccount,
  initContract
}

export {
  web3Saga,
  accountsSaga,
  defaultAccountSaga,
  contractSaga
}

export {
  web3WithChildrenSaga,
  childAccountsSaga,
  childDefaultAccountSaga
}

export default function * web3RootSaga () {
  yield takeEvery(types.INIT_WEB3_REQUEST, web3WithChildrenSaga)
}
