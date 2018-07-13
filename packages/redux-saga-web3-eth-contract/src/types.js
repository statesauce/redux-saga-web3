import Web3EthContract from "web3-eth-contract";
import { call, takeEvery, put, take } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";

import { formatName } from "redux-saga-web3-utils";

function createBaseTypeForMethod(name, method) {
  return `${formatName(name)}/METHODS/${formatName(method)}`;
}

function createTypesForMethodCall(name, method) {
  const baseType = `${createBaseTypeForMethod(name, method)}/CALL`;

  return {
    CALL: baseType,
    SUCCESS: baseType + "/SUCCESS",
    ERROR: baseType + "/ERROR",
  };
}

function createTypesForMethodSend(name, method) {
  const baseType = `${createBaseTypeForMethod(name, method)}/SEND`;

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

export {
  createBaseTypeForMethod,
  createTypesForEvent,
  createTypesForMethodCall,
  createTypesForMethodSend,
  createTypesForGetPastEvents,
  decomposeType,
};
