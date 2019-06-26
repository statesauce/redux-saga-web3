import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { List, Map, fromJS } from "immutable";
import { compose } from "redux";
import { types as web3Types } from "@statesauce/web3";
import { call, takeEvery, put, take, select, all } from "redux-saga/effects";
import {
  createSaga as createSubscriptionSaga,
  createTypes as createSubscriptionTypes,
} from "@statesauce/web3-eth-subscribe";

import { create as createSaga } from "./saga";
import { create as createReducer } from "./reducer";
import {
  createActionsForInterface,
  createActionsForMapping,
  createActionsForMethod,
  createActionForMethodCall,
  createActionForMethodSend,
  createActionsForEvent,
  createActionForEventGet,
  createActionForEventSubscribe,
} from "./actions";
import {
  createSelectorForMapping,
  createSelectorForMethod,
  createSelectorsForInterface,
  selectIsSubscribed,
} from "./selectors";
import {
  createType,
  createTypesForEvent,
  createTypesForEventSubscribe,
  createTypesForEventGet,
  createTypesForMapping,
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
    this.web3Instance = this.instantiateWeb3(options);

    this.contract = new this.web3Instance.eth.Contract(abi, options.at);
    this._types = createTypesForInterface(namespace, abi);
    this._actions = createActionsForInterface(namespace, abi);
    this._reducer = { [namespace]: createReducer(namespace, abi, options.at) };
    this._selectors = createSelectorsForInterface(namespace, abi, options.at);
    this._saga = createSaga(
      namespace,
      this.contract,
      Object.keys(this.types.methods),
      Object.keys(this.types.events)
    );

    this._attachedActions = {};
    this._attachedTypes = {};
    this._attachedSelectors = {};
    this._attachedReducers = [];
    this._attachedSagas = [];
  }

  get actions() {
    return {
      ...this._actions,
      ...this._attachedActions,
    };
  }

  get selectors() {
    return {
      ...this._selectors,
      ...this._attachedSelectors,
    };
  }

  get types() {
    return {
      ...this._types,
      ...this._attachedTypes,
    };
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

  instantiateWeb3({ web3Instance, provider }) {
    if (web3Instance) return web3Instance;
    if (provider) return new Web3(provider);
  }

  createMapping(name, event, saga) {
    const self = this;
    const actions = (options, meta = {}) =>
      createActionsForMapping(this._namespace, name, options, {
        ...meta,
        isMapping: true,
      });
    const types = createTypesForMapping(this._namespace, name);
    const selectors = options =>
      createSelectorForMapping(this._namespace, name, options);

    this._attachedActions = {
      ...this._attachedActions,
      mappings: {
        ...this._attachedActions.mappings,
        [name]: actions,
      },
    };
    this._attachedSelectors = {
      ...this._attachedSelectors,
      mappings: {
        ...this._attachedSelectors.mappings,
        [name]: selectors,
      },
    };
    this._attachedTypes = {
      ...this._attachedTypes,
      mappings: {
        ...this._attachedTypes.mappings,
        [name]: types,
      },
    };

    this._attachedSagas.push([
      takeEvery(types.INIT, function*({ meta, payload: { options } }) {
        yield put(self.actions.events[event].subscribe(options, meta));
      }),
      takeEvery(self.types.events[event].subscribe.DATA, function*({
        meta,
        payload,
      }) {
        if (meta.isMapping) {
          const state = yield select(selectors(meta.options));
          yield put({
            type: self.types.mappings[name].DATA,
            payload,
            meta,
            state: state ? state : undefined,
          });
        }
      }),
      takeEvery(self.types.mappings[name].DATA, function*(action) {
        const payload = yield saga(action);
        yield put({
          type: self.types.mappings[name].MAPPED,
          payload,
          meta: action.meta,
        });
      }),
    ]);

    this._attachedReducers.push((state, action) => {
      const { type, payload } = action;
      if (type === self.types.mappings[name].MAPPED) {
        let address = pickAddress(action);
        return {
          ...state,
          contracts: {
            ...state.contracts,
            [address]: {
              ...state.contracts[address],
              mappings: {
                ...state.contracts[address].mappings,
                [name]: {
                  ...state.contracts[address].mappings[name],
                  payload,
                },
              },
            },
          },
        };
      }

      return state;
    });
  }

  attachMethod(method, saga, reducer) {
    const actions = (options, meta) =>
      createActionsForMethod(this._namespace, method, options, meta);
    const types = createTypesForMethod(this._namespace, method);
    const selectors = options =>
      createSelectorForMethod(this._namespace, method, options);

    this._attachedActions = {
      ...this._attachedActions,
      methods: {
        ...this._attachedActions.methods,
        [method]: actions,
      },
    };
    this._attachedSelectors = {
      ...this._attachedSelectors,
      methods: {
        ...this._attachedSelectors.methods,
        [method]: selectors,
      },
    };
    this._attachedTypes = {
      ...this._attachedTypes,
      methods: {
        ...this._attachedTypes.methods,
        [method]: types,
      },
    };
    this._attachedSagas.push(saga(types)());

    if (reducer) {
      this._attachedReducers.push((state = {}, action) => {
        let address = pickAddress(action);
        if (
          address &&
          Object.values(types.call)
            .concat(Object.values(types.send))
            .includes(action.type)
        ) {
          return {
            ...state,
            contracts: {
              ...state.contracts,
              [address]: {
                ...state.contracts[address],
                methods: {
                  ...state.contracts[address].methods,
                  [method]: {
                    ...state.contracts[address].mappings[method],
                    ...reducer(types)(state, action),
                  },
                },
              },
            },
          };
        }

        return state;
      });
    }
  }
}

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
