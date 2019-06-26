import { call, put, takeEvery, getContext } from "redux-saga/effects";
import * as types from "./types";
import { blocksActions as actions } from "./actions";
import { createSaga } from "@statesauce/web3-eth-subscribe";

function* getBlockHeader({ payload: { hash } }) {
  const web3 = yield getContext("web3");
  try {
    const payload = yield call(web3.eth.getBlock, hash);
    yield put(actions.getSuccess(payload, hash));
  } catch (error) {
    yield put(actions.getFailure(error));
  }
}

export default function* saga() {
  yield* createSaga("blocks", "newBlockHeaders")();
  yield takeEvery(types.blockHeaders.GET, getBlockHeader);
}
