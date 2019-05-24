import types from "./types";

const networkActions = {
  getId: () => ({
    type: types.GET_ID_REQUEST,
  }),
  getIdFailure: error => ({
    type: types.GET_ID_FAILURE,
    payload: error,
    error: true,
  }),
  getIdSuccess: network => ({
    type: types.GET_ID_SUCCESS,
    payload: network,
  }),
};

export default networkActions;
