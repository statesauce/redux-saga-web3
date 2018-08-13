const NETWORK = "network";
const ID = "id";

const selectNetworkId = state =>
  state.hasIn([NETWORK, ID]) ? state.getIn([NETWORK, ID]) : null;

export default {
  selectNetworkId,
};
