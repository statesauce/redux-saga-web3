import Web3EthContract from "web3-eth-contract";
import { call, takeEvery, put } from "redux-saga/effects";
import snakeCase from "lodash.snakecase";

function create(name, abi) {
  const contract = new Web3EthContract(abi, "");

  return () =>
    Object.keys(contract.methods).reduce((reduction, method) => {
      // web3 has duplicate instances of all methods
      if (method.slice(-2) === "()" || method.slice(2) === "0x") {
        return reduction;
      }
      const patternPrefix = `${snakeCase(name).toUpperCase()}/${snakeCase(
        method
      ).toUpperCase()}`;
      return [
        ...reduction,
        takeEvery(`${patternPrefix}_CALL`, ({}) => [
          call(contract.methods[method].call),
          put({ type: `${patternPrefix}_CALL_SUCCESS` }),
        ]),
      ];
    }, []);
}

export { create };
