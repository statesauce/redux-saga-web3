import ACCOUNTS from "./types";
import keys from "./stateKeys";

export const initialState = {
  isLoading: false,
  items: null,
  error: null,
};

export default (state = initialState, { type, payload, error }) => {
  switch (type) {
    case ACCOUNTS.GET_REQUEST: {
      return {
        ...state,
        [keys.IS_LOADING]: true,
      };
    }
    case ACCOUNTS.GET_SUCCESS: {
      return {
        ...state,
        [keys.IS_LOADING]: false,
        [keys.ITEMS]: payload,
      };
    }
    case ACCOUNTS.GET_FAILURE: {
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
