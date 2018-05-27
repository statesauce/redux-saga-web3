import WEB3 from "./types";

const initialState = {
  isLoading: false,
  status: "uninitialized",
};

export default (state = initialState, { type, status }) => {
  switch (type) {
    case WEB3.INIT:
      return {
        ...state,
        isLoading: true,
      };
    case WEB3.INIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        status,
      };
    case WEB3.INIT_FAILURE:
      return {
        ...state,
        isLoading: false,
        status,
      };

    default:
      return state;
  }
};
