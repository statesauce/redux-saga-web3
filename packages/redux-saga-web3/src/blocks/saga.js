import { call, put, takeEvery, getContext } from "redux-saga/effects";
import { createSaga } from "redux-saga-web3-eth-subscribe";
import * as types from "./types";

export const getBlockHeader = function*({
  payload: { blockHashOrBlockNumber },
}) {
  const web3 = yield getContext("web3");

  try {
    const payload = yield call(web3.eth.getBlock, blockHashOrBlockNumber);
    yield put({
      type: types.blockHeaders.GET_SUCCESS,
      payload: payload,
      meta: {
        blockHashOrBlockNumber,
      },
    });
  } catch (error) {
    yield put({
      type: types.blockHeaders.GET_FAILURE,
      payload: error,
    });
  }
};

export default function* saga() {
  yield createSaga("blocks", "newBlockHeaders");
  yield takeEvery(types.blockHeaders.GET_REQUEST, getBlockHeader);
}
