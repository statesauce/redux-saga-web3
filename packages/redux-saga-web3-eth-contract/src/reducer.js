import { Map, Stack, fromJS } from "immutable";

import { createBaseTypeForMethod, decomposeType } from "./types";

const PHASES = {
  CALL: "CALLED",
  SEND: "SENT",
  SUCCESS: "SUCCESS",
  TRANSACTION_HASH: "PENDING",
  RECEIPT: "SUCCESS",
  ERROR: "ERROR",
};

export function create(namespace, abi) {
  const initialState = Map({
    contracts: Map(),
  });

  const types = abi.reduce((reduction, subABI) => {
    return reduction.merge(
      Map({
        [createBaseTypeForMethod(namespace, subABI.name)]: fromJS(subABI),
      })
    );
  }, Map());

  return function(state = initialState, { type, meta, payload }) {
    const { base, directive, phase } = decomposeType(type);
    if (types.has(base)) {
      const methodABI = types.get(base);
      if (phase === "") {
        const { args, options } = payload;
        return state.setIn(
          ["contracts", options.at, methodABI.get("name"), ...args],
          Map({ value: null, phase: PHASES[directive] })
        );
      } else if (phase === "TRANSACTION_HASH") {
        const { args, options } = meta;
        return state.setIn(
          ["contracts", options.at, methodABI.get("name"), ...args],
          Map({ transactionHash: payload, phase: PHASES[phase] })
        );
      } else if (phase === "RECEIPT") {
        const { args, options } = meta;
        return state.setIn(
          ["contracts", options.at, methodABI.get("name"), ...args],
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
            options.at,
            methodABI.get("name"),
            ...args,
            "confirmations",
          ],
          state
            .getIn([
              "contracts",
              options.at,
              methodABI.get("name"),
              ...args,
              "confirmations",
            ])
            .push(payload)
        );
      } else {
        const { args, options } = meta;
        return state.setIn(
          ["contracts", options.at, methodABI.get("name"), ...args],
          Map({ value: payload, phase: "ERROR" })
        );
      }
    }

    return state;
  };
}
