import { types, creators } from 'redux-web3-constants'
import { initializeContract } from 'redux-web3-utils'

import { call, put, takeEvery } from 'redux-saga/effects'

export const initContract = function * ({ payload: artifact }) {
  try {
    const contract = yield call(initializeContract, artifact)
    const instance = yield call(contract.deployed)
    yield put.resolve(creators.initContractSuccess(instance))
  } catch (err) {
    yield put.resolve(creators.initContractFailure(err))
  }
}

export function * contractSaga () {
  yield takeEvery(types.CONTRACT.INIT_REQUEST, initContract)
}
