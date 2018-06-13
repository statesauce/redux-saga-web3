import types from "./types";

const accountsActions = {
  getRequest: () => ({
    type: types.GET_REQUEST,
  }),
  getFailure: error => ({
    type: types.GET_FAILURE,
    payload: error,
    error: true,
  }),
  getSuccess: accounts => ({
    type: types.GET_SUCCESS,
    payload: accounts,
  }),
};

export default accountsActions;
