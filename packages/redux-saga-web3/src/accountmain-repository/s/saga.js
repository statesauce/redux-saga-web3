import { delay } from "redux-saga";
import { call, put, takeEvery, getContext } from "redux-saga/effects";

import ACCOUNTS from "./types";

export const getAccounts = function*() {
  const web3 = yield getContext("web3");

  try {
    const payload = yield call(web3.eth.getAccounts);
    yield put({
      type: ACCOUNTS.GET_SUCCESS,
      payload: payload
    });
  } catch (error) {
    debugger
    yield put({
      type: ACCOUNTS.GET_FAILURE,
      payload: error
    });
  }
};

export default function* saga() {
  yield takeEvery(ACCOUNTS.GET, getAccounts);
}
