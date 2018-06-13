import { createSaga } from "redux-saga-web3-eth-subscribe";

export default function* saga() {
  yield createSaga("blocks", "newBlockHeaders");
}
