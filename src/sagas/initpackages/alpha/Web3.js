import { put, takeEvery, getContext } from 'redux-saga/effects'
import { types, creators } from '../constants'

export function * initWeb3 ({ provider }) {
  try {
    const web3 = yield getContext('web3')
    web3.setProvider(provider)
    yield put(creators.initWeb3Success(web3))
    yield put(creators.getAccountsRequest())
  } catch (error) {
    yield put(creators.initWeb3Failure(error))
  }
}

export function * web3Saga () {
  yield takeEvery(types.WEB3.INIT_REQUEST, initWeb3)
}