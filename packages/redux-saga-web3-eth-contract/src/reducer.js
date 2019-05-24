import { Map, OrderedSet, Stack, fromJS } from "immutable";

import {
  createType,
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

function resultToMap(result) {
  return Object.getOwnPropertyNames(result).reduce(
    (reduction, prop) => reduction.set(prop, result[prop]),
    Map()
  );
}

const initialState = Map({
  contracts: Map(),
});

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
export function create(namespace, abi, address) {
  const types = generateTypes(namespace, abi);

  return function(_state = initialState, { type, meta, payload }) {
    const { base, directive, phase } = decomposeType(type);
    const state = fromJS(_state);
    if (types.has(base)) {
      const methodABI = types.get(base);

      if (methodABI.get("type") === "function") {
        if (phase === "") {
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
        } else if (phase === "TRANSACTION_HASH") {
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
        } else if (phase === "RECEIPT") {
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
        } else if (phase === "CONFIRMATION") {
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
        } else {
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
              value:
                typeof payload === "object" ? resultToMap(payload) : payload,
              phase: PHASES[phase],
            })
          );
        }
      } else if (methodABI.get("type") === "event") {
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
                })
            );
          } else {
            return state.setIn(
              ["contracts", options.at ? options.at : address, "events", event],
              fromJS(payload).toOrderedSet()
            );
          }
        }
      }
    }

    return state;
  };
}
