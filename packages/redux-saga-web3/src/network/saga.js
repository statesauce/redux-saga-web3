import { call, put, takeEvery, getContext } from "redux-saga/effects";

import NETWORK from "./types";
import actions from "./actions";

export const getNetwork = function*() {
  const web3 = yield getContext("web3");

  try {
    const payload = yield call(web3.eth.net.getId);
    yield put(actions.getIdSuccess(payload));
  } catch (error) {
    yield put(actions.getIdFailure(error));
  }
};

export default function* saga() {
  yield takeEvery(NETWORK.GET_ID_REQUEST, getNetwork);
}
