import {
  call,
  put,
  takeEvery,
  getContext,
  setContext,
} from "redux-saga/effects";

import CONTEXT from "./types";
import actions from "./actions";

export const setWeb3Context = function*({ payload: { provider } }) {
  // let web3 = yield getContext("web3");
  // if (!web3) {
  // if (window.ethereum) yield call(window.ethereum.enable);
  yield setContext({ web3: provider });
  const currentContext = yield getContext("web3");
  // debugger;
  try {
    if (currentContext.version) {
      yield put(actions.setSuccess("WEB3_SET"));
    } else {
      yield put(actions.setFailure("TROUBLE"));
    }
  } catch (error) {
    yield put(actions.setFailure(error));
  }
  // }
};

export const stripWeb3Context = function*() {
  yield setContext({ web3: null });
  try {
    yield put(actions.stripSuccess());
  } catch (error) {
    yield put(actions.stripFailure(error));
  }
};
export default function* saga() {
  yield takeEvery(CONTEXT.SET_REQUEST, setWeb3Context);
  yield takeEvery(CONTEXT.STRIP_REQUEST, stripWeb3Context);
}
