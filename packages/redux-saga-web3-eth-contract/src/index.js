import Web3EthContract from "web3-eth-contract";
import { List, Map, fromJS } from "immutable";
import { compose } from "redux";
import { types as web3Types } from "redux-saga-web3";
import { call, takeEvery, put, take, select, all } from "redux-saga/effects";
import {
  createSaga as createSubscriptionSaga,
  createTypes as createSubscriptionTypes,
} from "redux-saga-web3-eth-subscribe";

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
  selectIsSubscribed,
} from "./selectors";
import {
  createType,
  createTypesForEvent,
  createTypesForEventSubscribe,
  createTypesForEventGet,
  createTypesForMethod,
  createTypesForMethodCall,
  createTypesForMethodSend,
  createTypesForInterface,
} from "./types";
import { pickAddress } from "./util";

class ReduxSagaWeb3EthContract {
  constructor(namespace, abi, options = {}) {
    this._namespace = namespace;
    this._options = options;
    this.contract = new Web3EthContract(abi, options.at);
    this._reducer = { [namespace]: createReducer(namespace, abi, options.at) };
    this._saga = createSaga(namespace, this.contract);
    this._types = createTypesForInterface(namespace, abi);
    this._actions = createActionsForInterface(namespace, abi);
    this._selectors = createSelectorsForInterface(namespace, abi, options.at);

    this._attachedActions = Map();
    this._attachedTypes = Map();
    this._attachedSelectors = Map();
    this._attachedReducers = [];
    this._attachedSagas = [];
  }

  get actions() {
    return fromJS(this._actions)
      .mergeDeep(this._attachedActions)
      .toJS();
  }

  get selectors() {
    return fromJS(this._selectors)
      .mergeDeep(this._attachedSelectors)
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
      yield all(self._attachedSagas);
    };
  }

  get reducer() {
    const key = Object.keys(this._reducer)[0];
    const baseReducer = Object.values(this._reducer)[0];

    return {
      [key]: (state, action) =>
        this._attachedReducers.reduce(
          (prevState, attachedReducer) => attachedReducer(prevState, action),
          baseReducer(state, action)
        ),
    };
  }

  attachMethod(method, saga, reducer) {
    const actions = (options, meta) =>
      createActionsForMethod(this._namespace, method, options, meta);
    const types = createTypesForMethod(this._namespace, method);
    const selectors = options =>
      createSelectorForMethod(this._namespace, method, options);

    this._attachedActions = this._attachedActions.setIn(
      ["methods", method],
      actions
    );
    this._attachedSelectors = this._attachedSelectors.setIn(
      ["methods", method],
      selectors
    );
    this._attachedTypes = this._attachedTypes.setIn(["methods", method], types);
    this._attachedSagas.push(saga(types)());

    if (reducer) {
      this._attachedReducers.push((state = Map({}), action) => {
        let address = pickAddress(action);
        if (
          address &&
          Object.values(types.call)
            .concat(Object.values(types.send))
            .includes(action.type)
        ) {
          return state.hasIn(["contracts", address, "methods", method])
            ? state.mergeDeepIn(
                ["contracts", address, "methods", method],
                reducer(types)(state, action)
              )
            : state.setIn(
                ["contracts", address, "methods", method],
                reducer(types)(state, action)
              );
        }

        return state;
      });
    }
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
