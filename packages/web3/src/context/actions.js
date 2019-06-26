import types from "./types";

const contextActions = {
  setRequest: provider => ({
    type: types.SET_REQUEST,
    payload: { provider },
  }),
  setFailure: error => ({
    type: types.SET_FAILURE,
    payload: error,
    error: true,
  }),
  setSuccess: status => ({
    type: types.SET_SUCCESS,
    payload: status,
  }),
  stripRequest: () => ({
    type: types.STRIP_REQUEST,
  }),
  stripFailure: error => ({
    type: types.STRIP_FAILURE,
    payload: error,
    error: true,
  }),
  stripSuccess: status => ({
    type: types.STRIP_SUCCESS,
    payload: status,
  }),
};

export default contextActions;
