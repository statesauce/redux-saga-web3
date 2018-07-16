import { createSelector } from "reselect";

const selectContracts = (state, { namespace }) =>
  state.getIn([namespace, "contracts"]);

const selectAddress = (_, props) => props.at;
const selectArgs = (_, props) => props.args;
const selectMethod = (_, props) => props.method;

const selectContract = createSelector(
  selectContracts,
  selectAddress,
  (contracts, address) => (contracts ? contracts.get(address) : null)
);

const selectMethodState = createSelector(
  selectContract,
  selectMethod,
  selectArgs,
  (contract, method, args) =>
    contract ? contract.getIn([method, ...args]) : null
);

function createSelectorForMethod(namespace, method, options = {}) {
  return (state, ...args) =>
    selectMethodState(state, { at: options.at, method, namespace, args });
}

function createSelectorsForInterface(namespace, abi) {
  return abi.reduce(
    (reduction, member) => {
      if (member.type === "function") {
        reduction.methods[member.name] = options =>
          createSelectorForMethod(namespace, member.name, options);
      }

      return reduction;
    },
    { methods: {}, events: {} }
  );
}

export { createSelectorsForInterface, createSelectorForMethod };
