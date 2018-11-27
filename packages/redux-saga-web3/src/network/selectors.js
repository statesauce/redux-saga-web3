const NETWORK = "network";
const ID = "id";

const selectId = state =>
  state.hasIn([NETWORK, ID]) ? state.getIn([NETWORK, ID]) : null;

export default {
  selectId,
};
