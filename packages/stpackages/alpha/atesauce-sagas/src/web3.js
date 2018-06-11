import { types, creators } from 'statesauce-constants'
import { getWeb3Proxy } from 'statesauce-utils'

import { put, call, takeEvery } from 'redux-saga/effects'

export function * initWeb3 ({ provider }) {
  try {
    const web3 = yield call(getWeb3Proxy, provider)
    yield put(creators.initWeb3Success(web3))
    yield put(creators.getAccountsRequest())
  } catch (error) {
    yield put(creators.initWeb3Failure(error))
  }
}

export function * web3Saga () {
  yield takeEvery(types.WEB3.INIT_REQUEST, initWeb3)
}
