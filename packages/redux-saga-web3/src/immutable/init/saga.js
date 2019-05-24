import { all, call, put, takeEvery, getContext } from "redux-saga/effects";

import INIT from "./types";
import actions from "./actions";

import { getAccounts } from "../accounts/saga";
import { getNetwork } from "../network/saga";

export const initWeb3 = function*() {
  const web3 = yield getContext("web3");
  try {
    yield* getAccounts();
    yield* getNetwork();
    yield put(actions.initSuccess());
  } catch (error) {
    yield put(actions.initFailure(error));
  }
};

export default function* saga() {
  yield takeEvery(INIT.REQUEST, initWeb3);
}
