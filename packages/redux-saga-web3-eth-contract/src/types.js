import { formatName } from "redux-saga-web3-utils";
import { isSendable } from "./util";

function createType(...args) {
  return args
    .reduce((baseType, arg) => `${baseType}${formatName(arg)}/`, "")
    .slice(0, -1);
}

function createBaseTypeForMethod(namespace, method) {
  return createType(namespace, "METHODS", method);
}

function createBaseTypeForEvent(namespace, event) {
  return createType(namespace, "EVENTS", event);
}

function createTypesForMethodCall(namespace, method) {
  const baseType = `${createBaseTypeForMethod(namespace, method)}/CALL`;
  return {
    CALL: baseType,
    SUCCESS: baseType + "/SUCCESS",
    ERROR: baseType + "/ERROR",
  };
}

function createTypesForMethodSend(namespace, method) {
  const baseType = `${createBaseTypeForMethod(namespace, method)}/SEND`;

  return {
    SEND: baseType,
    TRANSACTION_HASH: baseType + "/TRANSACTION_HASH",
    RECEIPT: baseType + "/RECEIPT",
    CONFIRMATION: baseType + "/CONFIRMATION",
    ERROR: baseType + "/ERROR",
  };
}

function createTypesForMapping(namespace, event) {
  const baseType = createType(namespace, "MAPPING", event);

  return {
    INIT: baseType + "/INIT",
    DATA: baseType + "/DATA",
    MAPPED: baseType + "/MAPPED",
    ERROR: baseType + "/ERROR",
  };
}

function createTypesForMethod(namespace, method) {
  if (!isSendable(method)) {
    return { call: createTypesForMethodCall(namespace, method.name) };
  }
  return {
    call: createTypesForMethodCall(namespace, method.name),
    send: createTypesForMethodSend(namespace, method.name),
  };
}

function createTypesForEventSubscribe(namespace, event) {
  const baseType = `${createBaseTypeForEvent(namespace, event)}/SUBSCRIBE`;

  return {
    SUBSCRIBE: baseType,
    DATA: baseType + "/DATA",
    CHANGED: baseType + "/CHANGED",
    ERROR: baseType + "/ERROR",
  };
}

function createTypesForEventGet(namespace, event) {
  const baseType = `${createBaseTypeForEvent(namespace, event)}/GET`;

  return {
    GET: baseType,
    SUCCESS: baseType + "/SUCCESS",
    ERROR: baseType + "/ERROR",
  };
}

function createTypesForEvent(namespace, event) {
  return {
    subscribe: createTypesForEventSubscribe(namespace, event),
    get: createTypesForEventGet(namespace, event),
  };
}

function decomposeType(type) {
  const splitType = type.split("/");
  if (splitType.length < 3) {
    return { base: "", directive: "", phase: "" };
  } else if (splitType.length === 3) {
    return {
      base: splitType.slice(0, 2).join("/"),
      directive: "",
      phase: splitType[2],
    };
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

function createTypesForInterface(namespace, abi) {
  return abi.reduce(
    (reduction, member) => {
      if (member.type === "function") {
        reduction.methods[member.name] = createTypesForMethod(
          namespace,
          member
        );
      } else if (member.type === "event") {
        reduction.events[member.name] = createTypesForEvent(
          namespace,
          member.name
        );
      }
      return reduction;
    },
    { methods: {}, events: {} }
  );
}

export {
  createType,
  createBaseTypeForEvent,
  createBaseTypeForMethod,
  createTypesForMapping,
  createTypesForMethod,
  createTypesForMethodCall,
  createTypesForMethodSend,
  createTypesForEvent,
  createTypesForEventGet,
  createTypesForEventSubscribe,
  createTypesForInterface,
  decomposeType,
};
