import Web3EthContract from "web3-eth-contract";

import { create as createSaga } from "./saga";
import { create as createReducer } from "./reducer";
import {
  createActionsForInterface,
  createActionEventSubscription,
  createActionForMethodCall,
  createActionForMethodSend,
  createActionGetPastEvents,
} from "./actions";
import { createSelectorForMethod } from "./selectors";
import {
  createTypesForEvent,
  createTypesForGetPastEvents,
  createTypesForMethodCall,
  createTypesForMethodSend,
  createTypesForInterface,
} from "./types";

class ReduxSagaWeb3EthContract {
  constructor(namespace, abi, address) {
    this.contract = new Web3EthContract(abi, address);
    this.reducer = createReducer(namespace, abi);
    this.saga = createSaga(namespace, this.contract);
    this.types = createTypesForInterface(namespace, abi);
    this.actions = createActionsForInterface(namespace, abi);
  }
}

export {
  createReducer,
  createSaga,
  createActionsForInterface,
  createActionEventSubscription,
  createActionForMethodCall,
  createActionForMethodSend,
  createTypesForEvent,
  createTypesForGetPastEvents,
  createTypesForMethodCall,
  createTypesForMethodSend,
  createActionGetPastEvents,
};
export default ReduxSagaWeb3EthContract;
