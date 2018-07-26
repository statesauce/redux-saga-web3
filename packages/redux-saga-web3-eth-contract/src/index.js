import Web3EthContract from "web3-eth-contract";
import { List, Map, fromJS } from "immutable";

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
    this._namespace = namespace;
    this.contract = new Web3EthContract(abi, address);
    this.reducer = { [namespace]: createReducer(namespace, abi) };
    this._saga = createSaga(namespace, this.contract);
    this._types = createTypesForInterface(namespace, abi);
    this._actions = createActionsForInterface(namespace, abi);
    this.selectors = createSelectorsForInterface(namespace, abi);

    this._attachedActions = Map();
    this._attachedTypes = Map();
    this._attachedSagas = function*() {};
  }

  get actions() {
    return fromJS(this._actions)
      .mergeDeep(this._attachedActions)
      .toJS();
  }

  get types() {
    return fromJS(this._types)
      .mergeDeep(this._attachedTypes)
      .toJS();
  }

  get saga() {
    const self = this;
    return function*() {
      yield* self._saga();
      yield* self._attachedSagas();
    };
  }

  attachMethod(method, saga, reducer) {
    const actions = (options, meta) =>
      createActionsForMethod(this._namespace, method, options, meta);
    const types = createTypesForMethod(this._namespace, method);
    this._attachedActions = this._attachedActions.setIn(
      ["methods", method],
      actions
    );
    this._attachedTypes = this._attachedTypes.setIn(["methods", method], types);
    this._attachedSagas = function*() {
      yield* this._attachedSagas;
      yield* saga(types)();
    };
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
  createTypesForMethod,
  createTypesForMethodCall,
  createTypesForMethodSend,
};
export default ReduxSagaWeb3EthContract;
