import { call, put, takeEvery, select } from 'redux-saga/effects'
import { types, creators } from '../constants'

export const getAccounts = function * () {
  const web3 = yield select(state => state.web3.instance)
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
