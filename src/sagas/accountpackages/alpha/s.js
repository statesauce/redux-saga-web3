import { call, put, takeEvery, getContext } from 'redux-saga/effects'
import { types, creators } from '../constants'

export const getAccounts = function * () {
  const web3 = yield getContext('web3')
  try {
    const payload = yield call(web3.eth.getAccounts)
    yield put(creators.getAccountsSuccess(payload))
  } catch (error) {
    yield put(creators.getAccountsFailure(error))
  }
}

export function * accountsSaga () {
  yield takeEvery(types.ACCOUNTS.GET_REQUEST, getAccounts)
}
