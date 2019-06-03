import NETWORK from "./types";
import INIT from "../init/types";

import keys from "./stateKeys";

export const initialState = {
  isLoading: false,
  id: null,
  error: null,
};

export default (state = initialState, { type, payload, error }) => {
  switch (type) {
    case NETWORK.GET_ID_REQUEST: {
      return {
        ...state,
        [keys.IS_LOADING]: true,
      };
    }
    case NETWORK.GET_ID_SUCCESS: {
      return {
        ...state,
        [keys.IS_LOADING]: false,
        [keys.ID]: payload,
      };
    }
    case NETWORK.GET_ID_FAILURE: {
      return {
        ...state,
        [keys.IS_LOADING]: false,
        [keys.ERROR]: payload,
      };
    }
    case INIT.REQUEST: {
      return {
        ...state,
        [keys.IS_LOADING]: true,
      };
    }
    case INIT.SUCCESS: {
      return {
        ...state,
        [keys.IS_LOADING]: false,
      };
    }
    case INIT.FAILURE: {
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
