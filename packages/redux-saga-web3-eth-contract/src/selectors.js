import { createSelector } from "reselect";
import { isCollection } from "immutable";

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
  selectFilter,
  (contract, method, args, filter) => {
    if (!contract) {
      return null;
    }

    let state = contract.getIn(["methods", method, ...args]);

    if (filter && isCollection(state)) {
      state = state.filter(filter);
    } else if (filter && !isCollection(state)) {
      console.warn(
        `Did not filter state for method "${method}". Method state needs to be a collection to be filtered.`
      );
    }

    return state;
  }
);

const selectEventState = createSelector(
  selectContract,
  selectEvent,
  selectFilter,
  (contract, event, filter) => {
    if (!contract) {
      return null;
    } else if (!filter) {
      return contract.getIn(["events", event]);
    } else {
      // TODO: Implement event filtering
      return contract.getIn(["events", event]).filter(item => true);
    }
  }
);

function createSelectorForMethod(namespace, method, options = {}) {
  return (state, ...args) =>
    selectMethodState(state, { ...options, method, namespace, args });
}

function createSelectorForEvent(namespace, event, options = {}) {
  return (state, filter) =>
    selectEventState(state, { ...options, event, namespace, filter });
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
