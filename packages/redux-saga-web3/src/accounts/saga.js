import { call, fork, put, takeEvery, getContext } from "redux-saga/effects";

import ACCOUNTS from "./types";
import actions from "./actions";

function* enableAccount() {
  const web3 = yield getContext("web3");
  yield window.ethereum.enable();
  const payload = yield call(web3.eth.getAccounts);
  yield put(actions.getSuccess(payload));
}

export const getAccounts = function*() {
  const web3 = yield getContext("web3");

  try {
    let payload = yield call(web3.eth.getAccounts);
    yield put(actions.getSuccess(payload));

    if (window.ethereum) {
      yield fork(enableAccount);
    }
  } catch (error) {
    yield put(actions.getFailure(error));
  }
};

export default function* saga() {
  yield takeEvery(ACCOUNTS.GET_REQUEST, getAccounts);
}
