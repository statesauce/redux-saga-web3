import { Map, fromJS } from "immutable";
import ACCOUNTS from "./types";

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
    default:
      return state;
  }
};
