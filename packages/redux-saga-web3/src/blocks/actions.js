import * as types from "./types";

function subscribeNewHeaders(options = {}) {
  return {
    type: types.newBlockHeaders.SUBSCRIBE,
    payload: { options },
  };
}

// function getBlockHeader(options = {}) {
//   return {
//     type: types.blocks.SUBSCRIBE,
//     payload: { options },
//   };
// }

export default {
  subscribeNewHeaders,
};
