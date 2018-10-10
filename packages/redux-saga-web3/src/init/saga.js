import { all, call, put, takeEvery, getContext } from "redux-saga/effects";

import INIT from "./types";
import actions from "./actions";

export const initWeb3 = function*() {
  const web3 = yield getContext("web3");
  try {
    const status = yield all({
      network: call(web3.eth.net.getId),
      accounts: call(web3.eth.getAccounts),
    });
    yield put(actions.initSuccess(status));
  } catch (error) {
    yield put(actions.initFailure(error));
  }
};

export default function* saga() {
  yield takeEvery(INIT.REQUEST, initWeb3);
}
