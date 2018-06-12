import types from "./types";

function subscribeNewHeaders() {
  return {
    type: types.SUBSCRIBE,
  };
}

export default {
  subscribeNewHeaders,
};
