import { getContext, takeEvery, put, take } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";
import Web3Eth from "web3-eth";

import BLOCKS from "./types";

function createEventChannel(eth) {
  const subscription = eth.subscribe("newBlockHeaders", () => {});
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

function* watchBlocksChannel({ payload: { options } }) {
  const { provider } = options;
  const web3 = yield getContext("web3");
  let eventChannel;

  if (provider) {
    const eth = new Web3Eth(provider);
    eventChannel = createEventChannel(eth);
  } else {
    eventChannel = createEventChannel(web3.eth);
  }

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
