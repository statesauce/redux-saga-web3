import Web3EthContract from "web3-eth-contract";
import { call, takeEvery, put, take } from "redux-saga/effects";
import { eventChannel, END } from "redux-saga";

import { formatName } from "./utils";

function createTypesForMethod(name, method) {
  const baseType = `${formatName(name)}/METHODS/${formatName(method)}_CALL`;

  return {
    SUCCESS: baseType + "/SUCCESS",
    ERROR: baseType + "/ERROR",
  };
}

function createTypesForEvent(name, event) {
  const baseType = `${formatName(name)}/EVENTS/${formatName(event)}/SUBSCRIBE`;

  return {
    DATA: baseType + "/DATA",
    ERROR: baseType + "/ERROR",
  };
}

function createTypes(name, abi) {
  const contract = new Web3EthContract(abi);

  return () => {
    const methods = Object.keys(contract.methods).reduce(
      (reduction, method) => {
        // web3 has duplicate instances of all methods
        if (method.slice(-2) === "()" || method.slice(2) === "0x") {
          return reduction;
        }

        return;
      },
      []
    );
  };
}

export { createTypes, createTypesForEvent, createTypesForMethod };
