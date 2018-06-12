import BLOCKS from "./types";

const initialState = {
  isLoading: false,
  headers: null,
  error: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case BLOCKS.SUBSCRIBE:
      return {
        ...state,
        isLoading: true,
      };
    case BLOCKS.DATA:
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
    case BLOCKS.ERROR:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    default:
      return state;
  }
};
