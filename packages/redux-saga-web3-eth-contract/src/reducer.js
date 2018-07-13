import { Map, Stack, fromJS } from "immutable";

import { createBaseTypeForMethod } from "./types";

const PHASES = {
  SUCCESS: "SUCCESS",
};

function decomposeType(type) {
  const splitType = type.split("/");
  if (splitType.length < 4) {
    return { base: "", directive: "", phase: "" };
  } else if (splitType.length === 4) {
    return {
      base: splitType.slice(0, 3).join("/"),
      directive: splitType[3],
      phase: "",
    };
  } else {
    return {
      base: splitType.slice(0, 3).join("/"),
      directive: splitType[3],
      phase: splitType[4],
    };
  }
}

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
        const phase = directive === "CALL" ? "CALLED" : "SENT";
        return state.setIn(
          ["contracts", options.at, methodABI.get("name"), ...args],
          Map({ value: null, phase })
        );
      } else if (phase === "SUCCESS") {
        const { args, options } = meta;
        return state.setIn(
          ["contracts", options.at, methodABI.get("name"), ...args],
          Map({ value: payload, phase: "SUCCESS" })
        );
      } else if (phase === "TRANSACTION_HASH") {
        const { args, options } = meta;
        return state.setIn(
          ["contracts", options.at, methodABI.get("name"), ...args],
          Map({ transactionHash: payload, phase: "PENDING" })
        );
      } else if (phase === "RECEIPT") {
        const { args, options } = meta;
        return state.setIn(
          ["contracts", options.at, methodABI.get("name"), ...args],
          Map({ receipt: payload, confirmations: Stack(), phase: "SUCCESS" })
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
      } else if (phase === "ERROR") {
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
