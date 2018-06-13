import * as types from './types';

const initialState = {
  isSubscribed: false,
  latest: null,
  headers: null,
  error: null,
};

export default (state = initialState, { type, meta, payload }) => {
  switch (type) {
    case types.blockHeaders.GET_REQUEST: {
      return {
        ...state,
      };
    }

    case types.newBlockHeaders.SUBSCRIBE: {
      return {
        ...state,
        isSubscribed: true,
      };
    }

    case types.blockHeaders.GET_SUCCESS: {
      const { number } = payload;
      const { blockHashOrBlockNumber } = meta;
      const { latest: prevLatest } = state;
      const latest =
        blockHashOrBlockNumber === "latest" && number > prevLatest
          ? number
          : prevLatest;
      return {
        ...state,
        latest,
        headers: {
          ...state.headers,
          [number]: payload,
        },
      };
    }

    case types.newBlockHeaders.DATA: {
      const { number } = payload;
      const { latest: prevLatest } = state;
      const latest = number > prevLatest ? number : prevLatest;
      return {
        ...state,
        latest,
        headers: {
          ...state.headers,
          [number]: payload,
        },
      };
    }

    case types.blockHeaders.GET_FAILURE:
    case types.newBlockHeaders.ERROR: {
      return {
        ...state,
        error: payload,
      };
    }

    default:
      return state;
  }
};
