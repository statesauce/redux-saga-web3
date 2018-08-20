import Web3EthContract from "web3-eth-contract";
import { List, Map, fromJS } from "immutable";
import { compose } from "redux";
import { types as web3Types } from "redux-saga-web3";
import { call, takeEvery, put, take, select } from "redux-saga/effects";
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

class ReduxSagaWeb3EthContract {
  constructor(namespace, abi, options = {}) {
    this._namespace = namespace;
    this._options = options;
    this.contract = new Web3EthContract(abi, options.at);
    this._reducer = { [namespace]: createReducer(namespace, abi) };
    this._saga = createSaga(namespace, this.contract);
    this._types = createTypesForInterface(namespace, abi);
    this._actions = createActionsForInterface(namespace, abi);
    this._selectors = createSelectorsForInterface(namespace, abi);

    this._attachedActions = Map();
    this._attachedTypes = Map();
    this._attachedSelectors = Map();
    this._attachedSagas = function*() {};
    this._attachedReducers = [];

    this._logsSubscriptionTypes = createSubscriptionTypes(
      this._namespace,
      "logs"
    );
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

    function* createLogsSubscription({ payload: { options } }) {
      const isSubscribed = yield select(selectIsSubscribed, {
        namespace: self._namespace,
        ...options,
      });

      // Subscribe to contract events
      if (!isSubscribed && self._options.provider) {
        yield put({
          type: self._logsSubscriptionTypes.SUBSCRIBE,
          payload: {
            options: { provider: self._options.provider, ...options },
          },
        });
      }
    }

    return function*() {
      // Subscribe to contract events for reactive state updates
      yield takeEvery(
        ({ type }) =>
          type.split("/").length > 0
            ? type.split("/")[0] === createType(self._namespace) &&
              type.split("/").slice(-1)[0] === "CALL"
            : false,
        createLogsSubscription
      );
      yield* createSubscriptionSaga(self._namespace, "logs")();

      yield* self._saga();
      yield* self._attachedSagas();
    };
  }

  get reducer() {
    const key = Object.keys(this._reducer)[0];
    const baseReducer = Object.values(this._reducer)[0];

    this._attachedReducers.push((state = Map({}), action) => {
      if (
        action.type === this._logsSubscriptionTypes.SUBSCRIBE &&
        action.payload &&
        action.payload.options &&
        action.payload.options.at
      ) {
        return state.setIn(
          ["contracts", action.payload.options.at, "isSubscribed"],
          true
        );
      }

      return state;
    });

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
    this._attachedSagas = function*() {
      yield* this._attachedSagas;
      yield* saga(types)();
    };

    if (reducer) {
      this._attachedReducers.push((state = Map({}), action) => {
        if (
          action.payload &&
          action.payload.meta &&
          action.payload.meta.options &&
          action.payload.meta.options.at
        ) {
          return state.setIn(
            ["contracts", action.payload.meta.options.at, "methods", method],
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
