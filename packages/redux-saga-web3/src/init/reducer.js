import INIT from "./types";
import keys from "./stateKeys";
import NETWORK from "../network/types";
import ACCOUNTS from "../accounts/types";

const statuses = {
  CONNECTED: "CONNECTED",
  UNAVAILABLE: "UNAVAILABLE",
  LOCKED: "ACCOUNT_LOCKED",
  GENERIC_ERROR: "UNAVAILABLE_OR_ACCOUNT_LOCKED",
};

export const initialState = {
  status: null,
  isInitialized: false,
  error: null,
};

export default (state = initialState, { type, payload, error }) => {
  switch (type) {
    case INIT.REQUEST: {
      return {
        ...state,
        [keys.IS_INITIALIZED]: false,
      };
    }
    case INIT.SUCCESS: {
      return {
        ...state,
        [keys.IS_INITIALIZED]: true,
      };
    }
    case INIT.FAILURE: {
      return {
        ...state,
        [keys.STATUS]: statuses.UNAVAILABLE,
        [keys.IS_INITIALIZED]: true,
        [keys.ERROR]: payload,
      };
    }
    case NETWORK.GET_ID_FAILURE: {
      return {
        ...state,
        [keys.STATUS]: statuses.UNAVAILABLE,
        [keys.ERROR]: payload,
      };
    }
    case ACCOUNTS.GET_SUCCESS: {
      const accounts = payload;
      const status = accounts.length ? statuses.CONNECTED : statuses.LOCKED;
      return {
        ...state,
        [keys.STATUS]: status,
        [keys.ERROR]: null,
      };
    }
    case ACCOUNTS.GET_FAILURE: {
      return {
        ...state,
        [keys.STATUS]: statuses.GENERIC_ERROR,
        [keys.ERROR]: payload,
      };
    }
    default:
      return state;
  }
};
