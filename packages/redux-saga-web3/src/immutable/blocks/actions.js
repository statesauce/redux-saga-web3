import * as types from "./types";

function getBlockHeader(blockHashOrBlockNumber) {
  return {
    type: types.blockHeaders.GET,
    payload: { hash: blockHashOrBlockNumber },
  };
}

function subscribeNewHeaders(options = {}) {
  return {
    type: types.newBlockHeaders.SUBSCRIBE,
    payload: { options },
  };
}

export default {
  getBlockHeader,
  subscribeNewHeaders,
};
