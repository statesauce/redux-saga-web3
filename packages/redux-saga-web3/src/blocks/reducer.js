import { Map } from "immutable";
import * as types from "./types";

const keys = {
  IS_SUBSCRIBED: "isSubscribed",
  LATEST: "latest",
  HEADERS: "headers",
  ERROR: "error",
};

const initialState = Map({
  isSubscribed: false,
  latest: null,
  headers: null,
  error: null,
});

export default (state = initialState, { type, meta, payload }) => {
  switch (type) {
    case types.blockHeaders.GET_REQUEST: {
      return state;
    }
    case types.newBlockHeaders.SUBSCRIBE: {
      return state.set(keys.IS_SUBSCRIBED, true);
    }
    case types.blockHeaders.GET_SUCCESS: {
      const prevLatest = state.get(keys.LATEST);
      const { number } = payload;
      const { blockHashOrBlockNumber } = meta;

      const latest =
        blockHashOrBlockNumber === keys.LATEST && number > prevLatest
          ? number
          : prevLatest;

      return state.mergeDeep(
        Map({
          [keys.LATEST]: latest,
          [keys.HEADERS]: Map({
            [number]: payload,
          }),
        })
      );
    }
    case types.newBlockHeaders.DATA: {
      const prevLatest = state.get(keys.LATEST);
      const { number } = payload;

      const latest = number > prevLatest ? number : prevLatest;

      return state.mergeDeep(
        Map({
          [keys.LATEST]: latest,
          [keys.HEADERS]: Map({
            [number]: payload,
          }),
        })
      );
    }
    case types.blockHeaders.GET_FAILURE:
    case types.newBlockHeaders.ERROR: {
      return state.set(keys.ERROR, payload);
    }

    default:
      return state;
  }
};
