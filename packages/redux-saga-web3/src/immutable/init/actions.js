import types from "./types";

export default {
  init: () => ({
    type: types.REQUEST,
  }),
  initFailure: error => ({
    type: types.FAILURE,
    payload: error,
    error: true,
  }),
  initSuccess: network => ({
    type: types.SUCCESS,
    payload: network,
  }),
};
