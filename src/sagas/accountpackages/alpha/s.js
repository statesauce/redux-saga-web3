import { delay } from 'redux-saga'
import { all, call, put, select, takeEvery } from 'redux-saga/effects'
import { types, creators, selectors } from '../constants'

/* TODO
  MAKE POLL INTERVAL CONFIG EASIER,
  REMOVE UNUSED EXPORT
*/
const pollInterval = 8000

export const getAccounts = function * () {
  const getter = yield select(selectors.getAccounts)
  try {
    const payload = yield call(getter)
    yield put(creators.getAccountsSuccess(payload))
  } catch (err) {
    yield put(creators.getAccountsFailure(err))
  }
}

export const pollAccounts = function * () {
  while (true) {
    try {
      yield call(delay, pollInterval)
      yield put(creators.getAccountsRequest())
    } catch (err) {
      yield put(creators.getAccountsFailure(err))
    }
  }
}

export const initPollAccountsSaga = function * () {
  yield all([
    put(creators.getAccountsRequest()),
    call(pollAccounts)
  ])
}

export const accountsSaga = function * () {
  yield takeEvery(types.GET_ACCOUNTS_REQUEST, getAccounts)
}

export default function * childAccountsSaga () {
  yield takeEvery(types.INIT_WEB3_SUCCESS, initPollAccountsSaga)
  yield takeEvery(types.GET_ACCOUNTS_REQUEST, getAccounts)
}
