import { getContext, takeEvery, put, take } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";

import BLOCKS from "./types";

function createEventChannel(web3) {
  const subscription = web3.eth.subscribe("newBlockHeaders", () => {});
  return eventChannel(emit => {
    subscription.on("data", data => {
      emit({
        type: BLOCKS.DATA,
        payload: data,
      });
    });
    subscription.on("error", data => {
      emit({
        type: BLOCKS.ERROR,
        payload: data,
      });
      emit(END);
    });

    return subscription.unsubscribe;
  });
}

function* watchBlocksChannel() {
  const web3 = yield getContext("web3");
  const eventChannel = createEventChannel(web3);
  try {
    while (true) {
      var event = yield take(eventChannel);
      yield put(event);
    }
  } finally {
    eventChannel.close();
  }
}

export default function* saga() {
  yield takeEvery(BLOCKS.SUBSCRIBE, watchBlocksChannel);
}
