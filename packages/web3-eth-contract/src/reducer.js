import { Map, Stack, fromJS } from "immutable";

import {
  createBaseTypeForMethod,
  createBaseTypeForEvent,
  decomposeType,
} from "./types";

const PHASES = {
  CALL: "CALLED",
  SEND: "SENT",
  SUCCESS: "SUCCESS",
  TRANSACTION_HASH: "PENDING",
  RECEIPT: "RECEIPT",
  ERROR: "ERROR",
};

const _initialState = Map({
  contracts: Map(),
});

function resultToMap(result) {
  return Object.getOwnPropertyNames(result).reduce(
    (reduction, prop) => reduction.set(prop, result[prop]),
    Map()
  );
}

function generateTypes(namespace, abi) {
  return abi.reduce((reduction, member) => {
    return reduction.merge(
      Map({
        [member.type === "function"
          ? createBaseTypeForMethod(namespace, member.name)
          : createBaseTypeForEvent(namespace, member.name)]: fromJS(member),
      })
    );
  }, Map());
}

// TODO -- Add support for paths; document where merging happens and why this is immutable
export function createAttachedReducer() {
  // eslint-disable-next-line no-unused-vars
  return function(_state = _initialState, { type, payload }) {
    const { directive, phase } = decomposeType(type);
    if (phase === "") return Map({ phase: PHASES[directive] });
    return Map({
      value: typeof payload === "object" ? resultToMap(payload) : payload,
      phase: PHASES[phase],
    });
  };
}

export function createMethodsReducer(methodABI, address) {
  return function(state, { type, meta, payload }) {
    const { directive, phase } = decomposeType(type);
    switch (phase) {
      case "": {
        const { args, options } = payload;
        return state.mergeIn(
          [
            "contracts",
            options.at ? options.at : address,
            "methods",
            methodABI.get("name"),
            ...(options.path ? options.path : args),
          ],
          Map({ phase: PHASES[directive] })
        );
      }
      case "TRANSACTION_HASH": {
        const { args, options } = meta;
        return state.mergeIn(
          [
            "contracts",
            options.at ? options.at : address,
            "methods",
            methodABI.get("name"),
            ...(options.path ? options.path : args),
          ],
          Map({
            confirmations: Stack(),
            transactionHash: payload,
            phase: PHASES[phase],
          })
        );
      }
      case "RECEIPT": {
        const { args, options } = meta;
        return state.mergeIn(
          [
            "contracts",
            options.at ? options.at : address,
            "methods",
            methodABI.get("name"),
            ...(options.path ? options.path : args),
          ],
          Map({
            receipt: payload,
            phase: PHASES[phase],
          })
        );
      }
      case "CONFIRMATION": {
        const { args, options } = meta;
        return state.setIn(
          [
            "contracts",
            options.at ? options.at : address,
            "methods",
            methodABI.get("name"),
            ...(options.path ? options.path : args),
            "confirmations",
          ],
          state
            .getIn([
              "contracts",
              options.at ? options.at : address,
              "methods",
              methodABI.get("name"),
              ...(options.path ? options.path : args),
              "confirmations",
            ])
            .push(payload)
        );
      }
      default: {
        const { args, options } = meta;
        return state.mergeIn(
          [
            "contracts",
            options.at ? options.at : address,
            "methods",
            methodABI.get("name"),
            ...(options.path ? options.path : args),
          ],
          Map({
            value: typeof payload === "object" ? resultToMap(payload) : payload,
            phase: PHASES[phase],
          })
        );
      }
    }
  };
}

export function createEventsReducer(address) {
  return function(state, { type, meta, payload }) {
    const { phase } = decomposeType(type);
    const { event, options } = meta;
    if (phase === "SUCCESS") {
      if (
        state.hasIn([
          "contracts",
          options.at ? options.at : address,
          "events",
          event,
        ])
      ) {
        // Merge new events and sort in decending order by block number
        return state.setIn(
          ["contracts", options.at ? options.at : address, "events", event],
          state
            .getIn([
              "contracts",
              options.at ? options.at : address,
              "events",
              event,
            ])
            .union(fromJS(payload).toOrderedSet())
            .sort((a, b) => {
              if (a.get("blockNumber") < b.get("blockNumber")) {
                return 1;
              }
              if (a.get("blockNumber") > b.get("blockNumber")) {
                return -1;
              }
              if (a.get("blockNumber") === b.get("blockNumber")) {
                return 0;
              }
              return 0;
            })
        );
      }
      return state.setIn(
        ["contracts", options.at ? options.at : address, "events", event],
        fromJS(payload).toOrderedSet()
      );
    }
    return state;
  };
}

export function createReducerForInterface(
  namespace,
  abi,
  address,
  initialState = _initialState
) {
  const types = generateTypes(namespace, abi);

  return function(state = initialState, action) {
    const { base } = decomposeType(action.type);
    if (types.has(base)) {
      const methodABI = types.get(base);

      switch (methodABI.get("type")) {
        case "function": {
          return createMethodsReducer(methodABI, address)(state, action);
        }
        case "event": {
          return createEventsReducer(methodABI, address);
        }
        default:
          return state;
      }
    }
    return state;
  };
}
