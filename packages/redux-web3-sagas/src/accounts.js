import { types, creators, selectors } from 'redux-web3-constants'

import { call, put, takeEvery, select } from 'redux-saga/effects'

export const getAccounts = function * () {
  const getter = yield select(selectors.getAccounts)
  try {
    const payload = yield call(getter)
    yield put(creators.getAccountsSuccess(payload))
  } catch (error) {
    yield put(creators.getAccountsFailure(error))
  }
}

export function * accountsSaga () {
  yield takeEvery(types.ACCOUNTS.GET_REQUEST, getAccounts)
}
