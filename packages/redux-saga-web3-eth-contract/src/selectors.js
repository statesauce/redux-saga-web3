import { createSelector } from "reselect";

const selectContracts = (state, { namespace }) =>
  state.getIn([namespace, "contracts"]);

const selectAddress = (_, props) => props.at;
const selectArgs = (_, props) => props.args;
const selectMethod = (_, props) => props.method;
const selectEvent = (_, props) => props.event;
const selectFilter = (_, props) => props.filter;

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
    contract ? contract.getIn(["methods", method, ...args]) : null
);

const selectEventState = createSelector(
  selectContract,
  selectEvent,
  selectFilter,
  (contract, event, filter) => {
    if (!contract) {
      return null;
    } else if (!filter) {
      return contract.getIn(["methods", event]);
    } else {
      // TODO: Implement event filtering
      return contract.getIn(["methods", event]).filter(item => true);
    }
  }
);

function createSelectorForMethod(namespace, method, options = {}) {
  return (state, ...args) =>
    selectMethodState(state, { at: options.at, method, namespace, args });
}

function createSelectorForEvent(namespace, event, options = {}) {
  return (state, filter) =>
    selectEventState(state, { at: options.at, event, namespace, filter });
}

function createSelectorsForInterface(namespace, abi) {
  return abi.reduce(
    (reduction, member) => {
      if (member.type === "function") {
        reduction.methods[member.name] = options =>
          createSelectorForMethod(namespace, member.name, options);
      } else if (member.type === "event") {
        reduction.events[member.name] = options =>
          createSelectorForEvent(namespace, member.name, options);
      }

      return reduction;
    },
    { methods: {}, events: {} }
  );
}

export { createSelectorsForInterface, createSelectorForMethod };
