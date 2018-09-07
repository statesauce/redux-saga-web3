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
  RECEIPT: "SUCCESS",
  ERROR: "ERROR",
};

export function create(namespace, abi, address) {
  const initialState = Map({
    contracts: Map(),
  });

  const types = abi.reduce((reduction, member) => {
    return reduction.merge(
      Map({
        [member.type === "function"
          ? createBaseTypeForMethod(namespace, member.name)
          : createBaseTypeForEvent(namespace, member.name)]: fromJS(member),
      })
    );
  }, Map());

  return function(state = initialState, { type, meta, payload }) {
    const { base, directive, phase } = decomposeType(type);
    if (types.has(base)) {
      const methodABI = types.get(base);

      if (methodABI.get("type") === "function") {
        if (phase === "") {
          const { args, options } = payload;
          return state.setIn(
            [
              "contracts",
              options.at ? options.at : address,
              "methods",
              methodABI.get("name"),
              ...(options.path ? options.path : args),
            ],
            Map({ value: null, phase: PHASES[directive] })
          );
        } else if (phase === "TRANSACTION_HASH") {
          const { args, options } = meta;
          return state.setIn(
            [
              "contracts",
              options.at ? options.at : address,
              "methods",
              methodABI.get("name"),
              ...(options.path ? options.path : args),
            ],
            Map({ transactionHash: payload, phase: PHASES[phase] })
          );
        } else if (phase === "RECEIPT") {
          const { args, options } = meta;
          return state.setIn(
            [
              "contracts",
              options.at ? options.at : address,
              "methods",
              methodABI.get("name"),
              ...(options.path ? options.path : args),
            ],
            Map({
              receipt: payload,
              confirmations: Stack(),
              phase: PHASES[phase],
            })
          );
        } else if (phase === "CONFIRMED") {
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
          return state.setIn(
            [
              "contracts",
              options.at ? options.at : address,
              "methods",
              methodABI.get("name"),
              ...(options.path ? options.path : args),
            ],
            Map({ value: payload, phase: PHASES[phase] })
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
