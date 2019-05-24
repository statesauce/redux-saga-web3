import { call, put, takeEvery, getContext } from "redux-saga/effects";
import { createSaga } from "redux-saga-web3-eth-subscribe";
import * as types from "./types";

function* getBlockHeader({ payload: { hash } }) {
  const web3 = yield getContext("web3");

  try {
    const payload = yield call(web3.eth.getBlock, hash, true);
    yield put({
      type: types.blockHeaders.SUCCESS,
      payload: payload,
      meta: {
        blockHashOrBlockNumber: hash,
      },
    });
  } catch (error) {
    yield put({
      type: types.blockHeaders.FAILURE,
      payload: error,
    });
  }
}

export default function* saga() {
  yield* createSaga("blocks", "newBlockHeaders")();
  yield takeEvery(types.blockHeaders.GET, getBlockHeader);
  yield takeEvery(types.newBlockHeaders.DATA, getBlockHeader);
}
