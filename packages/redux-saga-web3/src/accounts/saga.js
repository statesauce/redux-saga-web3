import { call, fork, put, takeEvery, getContext } from "redux-saga/effects";

import ACCOUNTS from "./types";
import actions from "./actions";

function* enableAccount() {
  const accounts = yield call(window.ethereum.enable);
  yield put(actions.getSuccess(accounts));
}

export const getAccounts = function*() {
  if (window.ethereum) {
    yield fork(enableAccount);
  } else {
    const web3 = yield getContext("web3");
    const payload = yield call(web3.eth.getAccounts);
    try {
      yield put(actions.getSuccess(payload));
    } catch (error) {
      yield put(actions.getFailure(error));
    }
  }
};

export default function* saga() {
  yield takeEvery(ACCOUNTS.GET_REQUEST, getAccounts);
}
