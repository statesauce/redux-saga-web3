import { call, put, takeEvery } from 'redux-saga/effects'
import { types, creators } from '../constants'

import initializeContract from '../util/initContract'

export const initContract = function * ({ payload: artifact }) {
  try {
    const contract = yield call(initializeContract, artifact)
    const instance = yield call(contract.deployed)
    yield put.resolve(creators.initContractSuccess(instance))
  } catch (err) {
    yield put.resolve(creators.initContractFailure(err))
  }
}

export default function * contractSaga () {
  yield takeEvery(types.CONTRACT.INIT_REQUEST, initContract)
}
