import * as types from "./types";

const initialState = {
  isLoading: false,
  headers: null,
  error: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.newBlockHeaders.SUBSCRIBE:
      return {
        ...state,
        isLoading: true,
      };
    case types.newBlockHeaders.DATA:
      const { number } = payload;
      return {
        ...state,
        isLoading: false,
        latest: number,
        headers: {
          ...state.headers,
          [number]: payload,
        },
      };
    case types.newBlockHeaders.ERROR:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    default:
      return state;
  }
};
