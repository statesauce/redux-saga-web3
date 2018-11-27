import { Map, fromJS, List } from "immutable";

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

const initialState = Map({
  status: null,
  isInitialized: false,
  error: null,
});

export default (state = initialState, { type, payload, error }) => {
  switch (type) {
    case INIT.REQUEST: {
      return state.set(keys.IS_INITIALIZED, false);
    }
    case INIT.SUCCESS: {
      return state.merge(
        Map({
          [keys.IS_INITIALIZED]: true,
        })
      );
    }
    case INIT.FAILURE: {
      return state.merge(
        Map({
          [keys.STATUS]: statuses.UNAVAILABLE,
          [keys.IS_INITIALIZED]: true,
          [keys.ERROR]: payload,
        })
      );
    }

    case NETWORK.GET_ID_FAILURE: {
      return state.merge(
        Map({
          [keys.STATUS]: statuses.UNAVAILABLE,
          [keys.ERROR]: fromJS(payload),
        })
      );
    }
    case ACCOUNTS.GET_SUCCESS: {
      const accounts = payload;
      const status = accounts.length ? statuses.CONNECTED : statuses.LOCKED;
      return state.merge(
        Map({
          [keys.STATUS]: status,
          [keys.ERROR]: null,
        })
      );
    }
    case ACCOUNTS.GET_FAILURE: {
      return state.merge(
        Map({
          [keys.STATUS]: statuses.GENERIC_ERROR,
          [keys.ERROR]: fromJS(payload),
        })
      );
    }
    default:
      return state;
  }
};
