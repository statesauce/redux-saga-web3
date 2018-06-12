import types from "./types";

function subscribeNewHeaders(options = {}) {
  return {
    type: types.SUBSCRIBE,
    payload: { options },
  };
}

export default {
  subscribeNewHeaders,
};
