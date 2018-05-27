import { put, takeEvery, getContext } from "redux-saga/effects";

import WEB3 from "./types";
import ACCOUNTS from "../accounts/types";

export function* initWeb3({ provider }) {
  try {
    const web3 = yield getContext("web3");
    web3.setProvider(provider);

    yield put({
      type: WEB3.INIT_SUCCESS,
      status: "initialized"
    });

    yield put({
      type: ACCOUNTS.GET
    });
  } catch (error) {
    yield put({
      type: WEB3.INIT_FAILURE,
      status: "failed"
    });
  }
}

export function* web3Saga() {
  yield takeEvery(WEB3.INIT, initWeb3);
}
