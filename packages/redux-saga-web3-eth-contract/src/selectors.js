import { createSelector } from "reselect";

const selectContracts = (state, { namespace }) =>
  state.getIn([namespace, "contracts"]);

const selectAddress = (_, props) => props.at;
const selectArgs = (_, props) => props.args;

const selectContract = createSelector(
  selectContracts,
  selectAddress,
  (contracts, address) => contracts.get(address)
);

const selectMethodState = createSelector(
  selectContract,
  selectArgs,
  (contract, args) => contract.getIn([...args])
);

function createSelectorForMethod(namespace, method, options = {}) {
  return (state, ...args) => selectMethodState(state, { at: options.at, args });
}

export { createSelectorForMethod };
