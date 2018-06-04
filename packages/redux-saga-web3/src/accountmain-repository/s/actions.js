import types from "./types";

function getAccounts() {
  return {
    type: types.GET,
  };
}

export default {
  getAccounts,
};
