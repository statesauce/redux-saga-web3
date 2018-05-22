import { all, call, put, fork, takeEvery } from 'redux-saga/effects'
import { types, creators } from '../constants'

import accountsSaga from './accounts'
import defaultAccountSaga from './defaultAccount'
import contractSaga from './contract'

import getWeb3Proxy from '../../util/getWeb3Proxy'

export function * initWeb3 ({ payload: rpcAddr }) {
  try {
    const web3 = yield call(getWeb3Proxy, rpcAddr)
    yield put.resolve(creators.initWeb3Success(web3))
  } catch (err) {
    yield put.resolve(creators.initWeb3Failure(err))
  }
}

export function * web3Saga () {
  yield takeEvery(types.INIT_WEB3_REQUEST, initWeb3)
}

export default function * web3WithChildrenSaga (action) {
  yield all([
    call(initWeb3, action),
    fork(accountsSaga),
    fork(contractSaga),
    fork(defaultAccountSaga)
  ])
}
