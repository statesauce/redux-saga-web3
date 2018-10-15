import { Map, fromJS } from "immutable";
import ACCOUNTS from "./types";
import INIT from "../init/types";

const keys = {
  IS_LOADING: "isLoading",
  ITEMS: "items",
  ERROR: "error",
};

const initialState = Map({
  isLoading: false,
  items: null,
  error: null,
});

export default (state = initialState, { type, payload, error }) => {
  switch (type) {
    case ACCOUNTS.GET_REQUEST:
      return state.set(keys.IS_LOADING, true);
    case ACCOUNTS.GET_SUCCESS:
      return state.merge(
        Map({
          [keys.IS_LOADING]: false,
          [keys.ITEMS]: fromJS(payload),
        })
      );
    case ACCOUNTS.GET_FAILURE:
      return state.merge(
        Map({
          [keys.IS_LOADING]: false,
          [keys.ERROR]: payload,
        })
      );
    case INIT.REQUEST: {
      return state.set(keys.IS_LOADING, true);
    }
    case INIT.SUCCESS: {
      return state.merge(
        Map({
          [keys.IS_LOADING]: false,
          [keys.ITEMS]: fromJS(payload.accounts),
        })
      );
    }
    case INIT.FAILURE: {
      return state.merge(
        Map({
          [keys.IS_LOADING]: false,
          [keys.ERROR]: payload,
        })
      );
    }
    default:
      return state;
  }
};
