import { call, put, takeEvery, getContext } from 'redux-saga/effects'

import ACCOUNTS from './types'
import actions from './actions'

export const getAccounts = function * () {
  const web3 = yield getContext('web3')

  try {
    const payload = yield call(web3.eth.getAccounts)
    yield put(actions.getSuccess(payload))
  } catch (error) {
    yield put(actions.getFailure(error))
  }
}

export default function * saga () {
  yield takeEvery(ACCOUNTS.GET_REQUEST, getAccounts)
}
