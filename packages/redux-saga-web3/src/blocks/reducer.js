import * as types from "./types";
import keys from "./stateKeys";

export const blocksInitialState = {
  isSubscribed: false,
  latest: null,
  headers: null,
  error: null,
};

export default (state = initialState, { type, meta, payload }) => {
  switch (type) {
    case types.newBlockHeaders.SUBSCRIBE: {
      return {
        ...state,
        [keys.IS_SUBSCRIBED]: true,
      };
    }
    case types.blockHeaders.GET: {
      return {
        ...state,
      };
    }
    case types.blockHeaders.SUCCESS: {
      const prevLatest = state[keys.LATEST];
      const number = payload && payload.number ? payload.number : null;
      const { blockHashOrBlockNumber } = meta;

      const latest =
        blockHashOrBlockNumber === keys.LATEST && number && number > prevLatest
          ? number
          : prevLatest;

      return {
        ...state,
        [keys.LATEST]: latest,
        [keys.HEADERS]: {
          ...state[keys.HEADERS],
          [number]: payload,
        },
      };
    }
    case types.newBlockHeaders.DATA: {
      const prevLatest = state[keys.LATEST];
      const { number } = payload;

      const latest = number > prevLatest ? number : prevLatest;

      return {
        ...state,
        [keys.LATEST]: latest,
        [keys.HEADERS]: {
          ...state[keys.HEADERS],
          [number]: payload,
        },
      };
    }
    case types.blockHeaders.FAILURE:
    case types.newBlockHeaders.ERROR: {
      return {
        ...state,
        [keys.ERROR]: payload,
      };
    }

    default:
      return state;
  }
};
