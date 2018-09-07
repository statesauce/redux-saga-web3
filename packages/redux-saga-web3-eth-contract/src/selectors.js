import { createSelector } from "reselect";
import { isCollection } from "immutable";

export const selectContracts = (state, { namespace }) =>
  state.getIn([namespace, "contracts"]);

const selectAddress = (_, props) => props.at;
const selectPath = (_, props) => props.path;
const selectMethod = (_, props) => props.method;
const selectEvent = (_, props) => props.event;
const selectReducer = (_, props) => props.reducer;

export const selectContract = createSelector(
  selectContracts,
  selectAddress,
  (contracts, address) => (contracts ? contracts.get(address) : null)
);

export const selectIsSubscribed = createSelector(
  selectContract,
  contract =>
    contract && contract.has("isSubscribed")
      ? contract.get("isSubscribed")
      : false
);

const selectMethodState = createSelector(
  selectContract,
  selectMethod,
  selectPath,
  selectReducer,
  (contract, method, path, reducer) => {
    if (!contract) {
      return null;
    }

    let state = contract.getIn(["methods", method, ...path]);

    if (reducer && isCollection(state)) {
      state = state.reduce(...reducer);
    } else if (reducer && !isCollection(state)) {
      console.warn(
        `Did not reduce state for method "${method}". Method state needs to be a collection to be reduced.`
      );
    }

    return state;
  }
);

const selectEventState = createSelector(
  selectContract,
  selectEvent,
  selectReducer,
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
  return (state, ...path) =>
    selectMethodState(state, { ...options, method, namespace, path });
}

function createSelectorForEvent(namespace, event, options = {}) {
  return (state, filter) =>
    selectEventState(state, { ...options, event, namespace, filter });
}

function createSelectorsForInterface(namespace, abi, address) {
  return abi.reduce(
    (reduction, member) => {
      if (member.type === "function") {
        reduction.methods[member.name] = (options = {}) =>
          createSelectorForMethod(
            namespace,
            member.name,
            options.at ? options : { ...options, at: address }
          );
      } else if (member.type === "event") {
        reduction.events[member.name] = (options = {}) =>
          createSelectorForEvent(
            namespace,
            member.name,
            options.at ? options : { ...options, at: address }
          );
      }

      return reduction;
    },
    { methods: {}, events: {} }
  );
}

export { createSelectorsForInterface, createSelectorForMethod };
