import CONTEXT from "./types";
import keys from "./stateKeys";

const initialState = {
  isLoading: false,
  status: "INITIAL",
  error: null,
};

export default (state = initialState, { type, payload, error }) => {
  switch (type) {
    case CONTEXT.SET_REQUEST: {
      return {
        ...state,
        [keys.IS_LOADING]: true,
      };
    }
    case CONTEXT.SET_SUCCESS: {
      return {
        ...state,
        [keys.IS_LOADING]: false,
        [keys.STATUS]: payload,
      };
    }
    case CONTEXT.SET_FAILURE: {
      return {
        ...state,
        [keys.IS_LOADING]: false,
        [keys.ERROR]: payload,
      };
    }
    case CONTEXT.STRIP_REQUEST: {
      return {
        ...state,
        [keys.IS_LOADING]: true,
      };
    }
    case CONTEXT.STRIP_SUCCESS: {
      return {
        ...state,
        [keys.IS_LOADING]: false,
        [keys.STATUS]: payload,
      };
    }
    case CONTEXT.STRIP_FAILURE: {
      return {
        ...state,
        [keys.IS_LOADING]: false,
        [keys.ERROR]: payload,
      };
    }
    default:
      return state;
  }
};
