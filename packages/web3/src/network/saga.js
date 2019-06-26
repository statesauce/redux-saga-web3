import { call, put, takeEvery, getContext, fork } from "redux-saga/effects";

import NETWORK from "./types";
import actions from "./actions";

function* enableNetwork() {
  const network = yield window.ethereum.networkVersion;
  yield put(actions.getIdSuccess(network));
}

export const getNetwork = function*() {
  if (window.ethereum) {
    yield fork(enableNetwork);
  } else {
    const web3 = yield getContext("web3");
    try {
      const payload = yield call(web3.eth.net.getId);
      yield put(actions.getIdSuccess(payload));
    } catch (error) {
      yield put(actions.getIdFailure(error));
    }
  }
};

export default function* saga() {
  yield takeEvery(NETWORK.GET_ID_REQUEST, getNetwork);
}
