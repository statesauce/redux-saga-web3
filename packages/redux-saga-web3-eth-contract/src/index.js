import Web3EthContract from "web3-eth-contract";

import { create as createSaga } from "./saga";
import { create as createReducer } from "./reducer";
import {
  createActionsForInterface,
  createActionsForMethod,
  createActionForMethodCall,
  createActionForMethodSend,
  createActionsForEvent,
  createActionForEventGet,
  createActionForEventSubscribe,
} from "./actions";
import {
  createSelectorForMethod,
  createSelectorsForInterface,
} from "./selectors";
import {
  createTypesForEvent,
  createTypesForEventSubscribe,
  createTypesForEventGet,
  createTypesForMethod,
  createTypesForMethodCall,
  createTypesForMethodSend,
  createTypesForInterface,
} from "./types";

class ReduxSagaWeb3EthContract {
  constructor(namespace, abi, address) {
    this.contract = new Web3EthContract(abi, address);
    this.reducer = { [namespace]: createReducer(namespace, abi) };
    this.saga = createSaga(namespace, this.contract);
    this.types = createTypesForInterface(namespace, abi);
    this.actions = createActionsForInterface(namespace, abi);
    this.selectors = createSelectorsForInterface(namespace, abi);
  }
}

ReduxSagaWeb3EthContract.setProvider = function(provider) {
  Web3EthContract.setProvider(provider);
};

export {
  createReducer,
  createSaga,
  createActionsForInterface,
  createActionsForEvent,
  createActionForEventSubscribe,
  createActionForEventGet,
  createActionsForMethod,
  createActionForMethodCall,
  createActionForMethodSend,
  createTypesForEventSubscribe,
  createTypesForEventGet,
  createTypesForMethodCall,
  createTypesForMethodSend,
};
export default ReduxSagaWeb3EthContract;
