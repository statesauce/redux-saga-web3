import { Map, fromJS } from "immutable";
import NETWORK from "./types";

const keys = {
  IS_LOADING: "isLoading",
  ITEMS: "items",
  ERROR: "error",
};

const initialState = Map({
  isLoading: false,
  id: null,
  error: null,
});

export default (state = initialState, { type, payload, error }) => {
  switch (type) {
    case NETWORK.GET_ID_REQUEST:
      return state.set(keys.IS_LOADING, true);
    case NETWORK.GET_ID_SUCCESS:
      return state.merge(
        Map({
          [keys.IS_LOADING]: false,
          id: fromJS(payload),
        })
      );
    case NETWORK.GET_ID_FAILURE:
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
