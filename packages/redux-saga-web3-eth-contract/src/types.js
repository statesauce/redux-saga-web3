import Web3EthContract from "web3-eth-contract";
import { call, takeEvery, put, take } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";

import { formatName } from "redux-saga-web3-utils";

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

function createTypesForEvent(name, event) {
  const baseType = `${formatName(name)}/EVENTS/${formatName(event)}/SUBSCRIBE`;

  return {
    SUBSCRIBE: baseType,
    DATA: baseType + "/DATA",
    CHANGED: baseType + "/CHANGED",
    ERROR: baseType + "/ERROR",
  };
}

function createTypesForGetPastEvents(name, event) {
  const baseType = `${formatName(name)}/GET_PAST_EVENTS`;

  return {
    CALL: baseType,
    SUCCESS: baseType + "/SUCCESS",
    ERROR: baseType + "/ERROR",
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
        reduction.methods[member.name] = {
          call: createTypesForMethodCall(namespace, member.name),
          send: createTypesForMethodSend(namespace, member.name),
        };
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
  createTypesForEvent,
  createTypesForMethodCall,
  createTypesForMethodSend,
  createTypesForGetPastEvents,
  createTypesForInterface,
  decomposeType,
};
